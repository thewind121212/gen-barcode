import type { z } from "zod";
import express from "express";
import type { CreateCategoryResponse, GetCategoryResponse, RemoveCategoryResponse } from "@Ciri/types/category";
import { createCategorySchema } from "@Ciri/core/dto/category/create-category.dto";
import { getCategorySchema } from "@Ciri/core/dto/category/get-category.dto";
import { removeCategorySchema } from "@Ciri/core/dto/category/remove-category.dto";
import { getContext } from "@Ciri/core/middlewares";
import { CategoryService } from "@Ciri/core/services/category.service";
import { ErrorResponses, sendSuccessResponse } from "@Ciri/core/utils/error-response";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";
import { getValidatedBody, validateBody } from "@Ciri/core/utils/validation";

const router = express.Router();
const categoryService = new CategoryService();

export type CreateCategoryRequestBody = z.infer<typeof createCategorySchema>;
export type CreateCategoryResponseServices = CreateCategoryResponse & {
      error: string | null;
    };
export type GetCategoryRequestBody = z.infer<typeof getCategorySchema>;
export type GetCategoryResponseServices = GetCategoryResponse & {
      error: string | null;
    };
export type RemoveCategoryRequestBody = z.infer<typeof removeCategorySchema>;
export type RemoveCategoryResponseServices = RemoveCategoryResponse & {
      error: string | null;
    };

router.post(
  "/CreateCategory",
  validateBody<CreateCategoryRequestBody>(createCategorySchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<CreateCategoryRequestBody>(req);
      const response = await categoryService.CreateCategory(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      sendSuccessResponse<CreateCategoryResponse>(res, 201, response);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Category CreateCategory:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.get(
  "/GetCategory",
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const response = await categoryService.GetCategory(ctx, req.query as GetCategoryRequestBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      sendSuccessResponse<GetCategoryResponse>(res, 200, response);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Category GetCategory:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.post(
  "/RemoveCategory",
  validateBody<RemoveCategoryRequestBody>(removeCategorySchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<RemoveCategoryRequestBody>(req);
      const response = await categoryService.RemoveCategory(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      sendSuccessResponse<RemoveCategoryResponse>(res, 201, response);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Category RemoveCategory:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

export default router;
