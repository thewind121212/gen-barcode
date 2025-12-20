import { NIL as NIL_UUID, validate as validateUuid } from "uuid";

import type {
  CreateCategoryRequestBody,
  CreateCategoryResponseServices,
  GetCategoryByIdRequestBody,
  GetCategoryByIdResponseServices,
  GetCategoryOverviewResponseServices,
  RemoveCategoryResponseServices,
  UpdateCategoryRequestBody,
  UpdateCategoryResponseServices,
} from "@Ciri/core/api/category/category.routes";
import type { RequestContext } from "@Ciri/core/middlewares";
import type { Prisma } from "@Ciri/generated/prisma/client.js";
import type {
  RemoveCategoryRequest,
} from "@Ciri/types/category";

import { CategoryRepository } from "@Ciri/core/repo/category.repo";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";

export class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
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

  async CreateCategory(ctx: RequestContext, req: CreateCategoryRequestBody): Promise<CreateCategoryResponseServices> {
    try {
      const { userId } = ctx;
      const storeId = this.ensureStoreId(ctx);
      const parentId = this.ensureParentId(req.parentId);

      if (!userId) {
        throw new Error("User ID is required");
      }

      if (req.layer !== "1" && parentId && req?.parentId) {
        const parent = await this.categoryRepo.findById(req.parentId, storeId);
        if (!parent) {
          throw new Error("Parent category not found in this store");
        }
      }

      const createPayload: Prisma.CategoryCreateInput = {
        name: req.name,
        description: req.description,
        colorSettings: req.colorSettings,
        status: req.status,
        layer: req.layer,
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

      const category = await this.categoryRepo.findById(req.categoryId, storeId);
      if (!category) {
        throw new Error("Category not found");
      }

      const subCategoriesCount = await this.categoryRepo.countChildren(category.id, storeId);

      return {
        resData: {
          categoryId: category.id,
          name: category.name,
          parentId: category.parentId ?? NIL_UUID,
          description: category.description ?? undefined,
          colorSettings: category.colorSettings ?? undefined,
          layer: category.layer,
          icon: category.icon ?? undefined,
          subCategoriesCount,
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

      const allowDeleteIds = categories.filter(category => (category.parentId === NIL_UUID || !category.parentId) && category.layer === "0").map(category => category.id);
      if (allowDeleteIds.length !== req.categoryIds.length) {
        return { resData: null, error: "No categories can be deleted" };
      }
      const { count } = await this.categoryRepo.deleteMany(allowDeleteIds, storeId);
      return { resData: { removedCount: count }, error: null };
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
        subCategoriesCount: category._count?.children ?? 0,
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
}
