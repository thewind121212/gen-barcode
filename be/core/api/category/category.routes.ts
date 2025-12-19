import type { z } from "zod";

import express from "express";

import type { CreateCategoryResponse, GetCategoryByIDResponse, RemoveCategoryResponse, GetCategoryOverviewResponse } from "@Ciri/types/category";

import { createCategorySchema } from "@Ciri/core/dto/category/create-category.dto";
import { getCategoryByIdSchema } from "@Ciri/core/dto/category/get-category-by-id.dto";
import { removeCategorySchema } from "@Ciri/core/dto/category/remove-category.dto";
import { getCategoryOverviewSchema } from "@Ciri/core/dto/category/get-category-overview.dto";
import { getContext } from "@Ciri/core/middlewares";
import { CategoryService } from "@Ciri/core/services/category.service";
import { ErrorResponses, sendSuccessResponse } from "@Ciri/core/utils/error-response";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";
import { getValidatedBody, validateBody } from "@Ciri/core/utils/validation";

const router = express.Router();
const categoryService = new CategoryService();

export type CreateCategoryRequestBody = z.infer<typeof createCategorySchema>;
export type CreateCategoryResponseServices = {
      resData: CreateCategoryResponse | null;
      error: string | null;
    };
export type GetCategoryByIdRequestBody = z.infer<typeof getCategoryByIdSchema>;
export type GetCategoryByIdResponseServices = {
      resData: GetCategoryByIDResponse | null;
      error: string | null;
    };
export type RemoveCategoryRequestBody = z.infer<typeof removeCategorySchema>;
export type RemoveCategoryResponseServices = {
      resData: RemoveCategoryResponse | null;
      error: string | null;
    };
export type GetCategoryOverviewRequestBody = z.infer<typeof getCategoryOverviewSchema>;
export type GetCategoryOverviewResponseServices = {
      resData: GetCategoryOverviewResponse | null;
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
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<CreateCategoryResponse>(res, 201, response.resData);
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
      const response = await categoryService.GetCategoryById(ctx, req.query as GetCategoryByIdRequestBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<GetCategoryByIDResponse>(res, 200, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Category GetCategoryById:",
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
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<RemoveCategoryResponse>(res, 201, response.resData);
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

router.get(
  "/GetCategoryOverview",
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const response = await categoryService.GetCategoryOverview(ctx, req.query as GetCategoryOverviewRequestBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<GetCategoryOverviewResponse>(res, 200, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Category GetCategoryOverview:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

export default router;
