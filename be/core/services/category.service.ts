import { NIL as NIL_UUID, validate as validateUuid } from "uuid";

import type {
  CreateCategoryRequestBody,
  CreateCategoryResponseServices,
  GetCategoryByIdRequestBody,
  GetCategoryByIdResponseServices,
  GetCategoryOverviewRequestQuery,
  GetCategoryOverviewResponseServices,
  GetCategoryOverviewWithDepthRequestQuery,
  GetCategoryOverviewWithDepthResponseServices,
  GetCategoryTreeRequestQuery,
  GetCategoryTreeResponseServices,
  RemoveCategoryResponseServices,
  UpdateCategoryRequestBody,
  UpdateCategoryResponseServices,
} from "@Ciri/core/api/category/category.routes";
import type { RequestContext } from "@Ciri/core/middlewares";
import type { Category, Prisma } from "@Ciri/generated/prisma/client.js";
import type {
  RemoveCategoryRequest,
} from "@Ciri/types/category";

import { INITIAL_LAYER, MAX_LAYER } from "@Ciri/config";
import { CategoryRepository } from "@Ciri/core/repo/category.repo";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";

export class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  private normalizeDepth(depth: number | undefined): number {
    const d = Math.floor(depth ?? 5);
    if (Number.isNaN(d) || d < 1) {
      return 1;
    }
    if (d > 5) {
      return 5;
    }
    return d;
  }

  private isRootParentId(parentId: string | null | undefined): boolean {
    return !parentId || parentId === NIL_UUID;
  }

  private ensureStoreId(ctx: RequestContext): string {
    const storeId = ctx.storeId;
    if (!storeId) {
      throw new Error("Store ID is required");
    }
    if (!validateUuid(storeId)) {
      throw new Error("Store ID is invalid");
    }
    return storeId;
  }

  private ensureParentId(parentId: string | undefined): string | null {
    if (!parentId) {
      return null;
    }
    if (parentId === NIL_UUID) {
      return null;
    }
    if (!parentId) {
      return null;
    }
    return parentId;
  }

  private async _unLinkParentCategoryById(categoryId: string, storeId: string): Promise<Category> {
    return this.categoryRepo.unLinkParentCategoryById(categoryId, storeId);
  }

  async CreateCategory(ctx: RequestContext, req: CreateCategoryRequestBody): Promise<CreateCategoryResponseServices> {
    try {
      const { userId } = ctx;
      const storeId = this.ensureStoreId(ctx);
      const parentId = this.ensureParentId(req.parentId);

      if (Number.isNaN(Number(req.layer))) {
        throw new TypeError("Layer must be a number");
      }

      if (req.layer && Number(req.layer) > MAX_LAYER) {
        throw new Error(`max layer is ${MAX_LAYER}`);
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      if (req.layer !== INITIAL_LAYER && req?.parentId === NIL_UUID) {
        throw new Error("Parent ID is required");
      }
      // Trust the layer from the query
      let layer = Number(req.layer);

      if (parentId && req?.parentId && parentId !== NIL_UUID) {
        const parent = await this.categoryRepo.findById(req.parentId, storeId);
        layer = Number(parent?.layer) + 1;
        if (layer > MAX_LAYER) {
          throw new Error(`max layer is ${MAX_LAYER}`);
        }
        if (!parent) {
          throw new Error("Parent category not found in this store");
        }
      }

      const createPayload: Prisma.CategoryCreateInput = {
        name: req.name,
        description: req.description,
        colorSettings: req.colorSettings,
        status: req.status,
        layer: layer.toString(),
        icon: req.icon,
        store: { connect: { id: storeId } },
      };

      if (parentId) {
        createPayload.parent = { connect: { id: req.parentId } };
      }

      const category = await this.categoryRepo.create(createPayload);

      return { resData: { categoryId: category.id }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category Create", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }

  async GetCategoryById(ctx: RequestContext, req: GetCategoryByIdRequestBody): Promise<GetCategoryByIdResponseServices> {
    try {
      const storeId = this.ensureStoreId(ctx);
      let parentName = "";

      const category = await this.categoryRepo.findById(req.categoryId, storeId);
      if (!category) {
        throw new Error("Category not found");
      }
      if (category.parentId && category.parentId !== NIL_UUID) {
        const parent = await this.categoryRepo.findById(category.parentId, storeId);
        if (!parent) {
          throw new Error("Parent category not found please edit now");
        }
        parentName = parent?.name ?? "";
      }

      const countDescendants = await this.categoryRepo.countDescendants(category.id, storeId);

      return {
        resData: {
          categoryId: category.id,
          name: category.name,
          parentId: category.parentId ?? NIL_UUID,
          parentName,
          description: category.description ?? undefined,
          colorSettings: category.colorSettings ?? undefined,
          layer: category.layer,
          icon: category.icon ?? undefined,
          subCategoriesCount: countDescendants,
          storeId,
          itemCount: 0,
          totalValue: 0,
          lowStockCount: 0,
        },
        error: null,
      };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category Get", LogLevel.ERROR, (error as Error).message);
      return {
        resData: null,
        error: (error as Error).message,
      };
    }
  }

  async RemoveCategory(ctx: RequestContext, req: RemoveCategoryRequest): Promise<RemoveCategoryResponseServices> {
    try {
      const storeId = this.ensureStoreId(ctx);

      const categories = await this.categoryRepo.findByIds(req.categoryIds, storeId);
      if (!categories || categories.length === 0) {
        return { resData: null, error: "Category not found" };
      }
      const allowDeleteIds = categories.map(category => category.id);
      // Todo if item of store is link to category we must unlink it some item have category some is orphan
      const removedCount = await this.categoryRepo.softDeleteMany(allowDeleteIds, storeId);
      return { resData: { removedCount }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category Remove", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }

  async UpdateCategory(ctx: RequestContext, req: UpdateCategoryRequestBody): Promise<UpdateCategoryResponseServices> {
    try {
      const storeId = this.ensureStoreId(ctx);
      const category = await this.categoryRepo.findById(req.categoryId, storeId);
      if (!category) {
        throw new Error("Category not found");
      }

      const parentId = this.ensureParentId(req.categoryUpdate.parentId as string | undefined);

      if (req.categoryUpdate.layer !== "1" && parentId && req.categoryUpdate?.parentId) {
        const parent = await this.categoryRepo.findById(req.categoryUpdate.parentId, storeId);
        if (!parent) {
          throw new Error("Parent category not found in this store");
        }
      }

      const updatePayload: Prisma.CategoryUpdateInput = {
        name: req.categoryUpdate.name,
        description: req.categoryUpdate.description,
        colorSettings: req.categoryUpdate.colorSettings,
        status: req.categoryUpdate.status,
        layer: req.categoryUpdate.layer,
        icon: req.categoryUpdate.icon,
      };

      if (req.categoryUpdate.parentId !== undefined) {
        if (parentId) {
          updatePayload.parent = { connect: { id: req.categoryUpdate.parentId } };
        }
        else {
          updatePayload.parent = { disconnect: true };
        }
      }

      const updatedCategory = await this.categoryRepo.findOneAndUpdate(req.categoryId, updatePayload);

      return { resData: { categoryId: updatedCategory.id }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category Update", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }

  async GetCategoryOverview(
    ctx: RequestContext,
    _req: GetCategoryOverviewRequestQuery,
  ): Promise<GetCategoryOverviewResponseServices> {
    try {
      const storeId = this.ensureStoreId(ctx);
      const categories = await this.categoryRepo.findAllByStore(storeId);

      const categoryOverviews = categories.map(category => ({
        categoryId: category.id,
        name: category.name,
        parentId: category.parentId ?? undefined,
        description: category.description ?? undefined,
        colorSettings: category.colorSettings ?? undefined,
        layer: category.layer,
        icon: category.icon ?? undefined,
        subCategoriesCount: category.descendantsCount ?? 0,
        status: category.status,
        storeId,
        // Item stats are not yet tracked; default to zero.
        itemCount: 0,
        totalValue: 0,
        lowStockCount: 0,
      }));

      return { resData: { categoryOverviews }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category GetOverview", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }

  async GetCategoryOverviewWithDepth(
    ctx: RequestContext,
    req: GetCategoryOverviewWithDepthRequestQuery,
  ): Promise<GetCategoryOverviewWithDepthResponseServices> {
    try {
      const storeId = this.ensureStoreId(ctx);
      const depth = this.normalizeDepth(req.depth);

      const categories = await this.categoryRepo.findAllByStore(storeId);

      const categoryOverviews = categories
        .filter((category) => {
          const layerNum = Number.parseInt(category.layer, 10);
          if (Number.isNaN(layerNum)) {
            return false;
          }
          return layerNum >= 1 && layerNum <= depth;
        })
        .map(category => ({
          categoryId: category.id,
          name: category.name,
          parentId: this.isRootParentId(category.parentId) ? undefined : category.parentId ?? undefined,
          description: category.description ?? undefined,
          colorSettings: category.colorSettings ?? undefined,
          layer: category.layer,
          icon: category.icon ?? undefined,
          subCategoriesCount: category.descendantsCount ?? 0,
          status: category.status,
          storeId,
          // This will be done later by repo item and stock
          itemCount: 0,
          totalValue: 0,
          lowStockCount: 0,
        }));

      return { resData: { categoryOverviews }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category GetOverviewWithDepth", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }

  async GetCategoryTree(
    ctx: RequestContext,
    req: GetCategoryTreeRequestQuery,
  ): Promise<GetCategoryTreeResponseServices> {
    try {
      const storeId = this.ensureStoreId(ctx);
      const rootCategoryId = req.categoryId;

      // Single optimized query: fetch all categories for the store once.
      const categories = await this.categoryRepo.findAllByStore(storeId);

      const idToCategory = new Map(categories.map(c => [c.id, c]));
      const isRoot = (c: (typeof categories)[number]) => c.layer === "1" && this.isRootParentId(c.parentId);

      let rootIds: string[] = [];
      if (rootCategoryId === NIL_UUID) {
        rootIds = categories.filter(isRoot).map(c => c.id);
      }
      else {
        const root = idToCategory.get(rootCategoryId);
        if (!root) {
          throw new Error("Root category not found");
        }
        if (!isRoot(root)) {
          throw new Error("Category is not a root category (layer must be 1)");
        }
        rootIds = [root.id];
      }

      const childrenByParentId = new Map<string, Array<(typeof categories)[number]>>();
      for (const c of categories) {
        const parentId = this.isRootParentId(c.parentId) ? null : c.parentId;
        if (!parentId) {
          continue;
        }
        const existing = childrenByParentId.get(parentId);
        if (existing)
          existing.push(c);
        else childrenByParentId.set(parentId, [c]);
      }

      // BFS from root(s) to produce a stable, hierarchical-ish ordering.
      const visited = new Set<string>();
      const queue: string[] = [...rootIds];
      const result: Array<(typeof categories)[number]> = [];

      while (queue.length > 0) {
        const id = queue.shift();
        if (!id)
          break;
        if (visited.has(id))
          continue;
        visited.add(id);

        const category = idToCategory.get(id);
        if (!category)
          continue;

        const layerNum = Number.parseInt(category.layer, 10);
        if (Number.isNaN(layerNum) || layerNum < 1 || layerNum > 5) {
          continue;
        }

        result.push(category);

        const children = childrenByParentId.get(category.id);
        if (children && children.length > 0) {
          for (const child of children) {
            queue.push(child.id);
          }
        }
      }

      const categoryTree = result.map(category => ({
        categoryId: category.id,
        name: category.name,
        parentId: this.isRootParentId(category.parentId) ? undefined : category.parentId ?? undefined,
        description: category.description ?? undefined,
        colorSettings: category.colorSettings ?? undefined,
        layer: category.layer,
        icon: category.icon ?? undefined,
        subCategoriesCount: category.descendantsCount ?? 0,
        status: category.status,
        storeId,
        // This will be done later by repo item and stock
        itemCount: 0,
        totalValue: 0,
        lowStockCount: 0,
      }));

      return { resData: { categoryTree }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category GetTree", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }
}
