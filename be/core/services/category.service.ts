import { validate as validateUuid, NIL as NIL_UUID } from "uuid";
import type {
  CreateCategoryRequestBody,
  CreateCategoryResponseServices,
  GetCategoryRequestBody,
  GetCategoryResponseServices,
  RemoveCategoryRequestBody,
  RemoveCategoryResponseServices,
} from "@Ciri/core/api/category/category.routes";
import type { RequestContext } from "@Ciri/core/middlewares";
import type { Prisma } from "@Ciri/generated/prisma/client.js";

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
      return null
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

  async GetCategory(ctx: RequestContext, req: GetCategoryRequestBody): Promise<GetCategoryResponseServices> {
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
        lowStockCount: 0,
        itemCount: 0,
        totalValue: 0,
        storeId: storeId,
        },
        error: null,
      };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category Get", LogLevel.ERROR, (error as Error).message);
      return { 
        resData: null,
        error: (error as Error).message };
    }
  }

  async RemoveCategory(ctx: RequestContext, req: RemoveCategoryRequestBody): Promise<RemoveCategoryResponseServices> {
    try {
      const storeId = this.ensureStoreId(ctx);

      const { count } = await this.categoryRepo.deleteMany(req.categoryIds, storeId);

      return { resData: { removedCount: count }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category Remove", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }
}
