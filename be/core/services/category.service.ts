import uuid from "uuid";

import type {
  CreateCategoryRequestBody,
  CreateCategoryResponseServices,
  GetCategoryRequestBody,
  GetCategoryResponseServices,
  RemoveCategoryRequestBody,
  RemoveCategoryResponseServices,
} from "@Ciri/core/api/category/category.routes";
import type { RequestContext } from "@Ciri/core/middlewares";

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
    if (!uuid.validate(storeId)) {
      throw new Error("Store ID is invalid");
    }
    return storeId;
  }

  async CreateCategory(ctx: RequestContext, req: CreateCategoryRequestBody): Promise<CreateCategoryResponseServices> {
    try {
      const { userId } = ctx;
      const storeId = this.ensureStoreId(ctx);

      if (!userId) {
        throw new Error("User ID is required");
      }

      if (req.layer !== "1" && req.parentId) {
        const parent = await this.categoryRepo.findById(req.parentId, storeId);
        if (!parent) {
          throw new Error("Parent category not found in this store");
        }
      }

      const category = await this.categoryRepo.create({
        name: req.name,
        description: req.description,
        colorSettings: req.colorSettings,
        layer: req.layer,
        parent: { connect: { id: req.parentId } },
        store: { connect: { id: storeId } },
      });

      return { categoryId: category.id, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category Create", LogLevel.ERROR, (error as Error).message);
      return { categoryId: undefined, error: (error as Error).message };
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
        categoryId: category.id,
        name: category.name,
        parentId: category.parentId ?? undefined,
        description: category.description ?? undefined,
        colorSettings: category.colorSettings ?? undefined,
        layer: category.layer,
        imageUrl: category.imageUrl ?? undefined,
        subCategoriesCount,
        error: null,
      };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category Get", LogLevel.ERROR, (error as Error).message);
      return { error: (error as Error).message };
    }
  }

  async RemoveCategory(ctx: RequestContext, req: RemoveCategoryRequestBody): Promise<RemoveCategoryResponseServices> {
    try {
      const storeId = this.ensureStoreId(ctx);

      const { count } = await this.categoryRepo.deleteMany(req.categoryIds, storeId);

      return { removedCount: count, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Category Remove", LogLevel.ERROR, (error as Error).message);
      return { removedCount: 0, error: (error as Error).message };
    }
  }
}
