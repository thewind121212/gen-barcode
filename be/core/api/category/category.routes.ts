import type { z } from "zod";

import express from "express";

import type { CategoryResponse, CreateCategoryResponse, GetCategoryOverviewResponse, GetCategoryTreeResponse, RemoveCategoryResponse, UpdateCategoryResponse } from "@Ciri/types/category";

import { createCategorySchema } from "@Ciri/core/dto/category/create-category.dto";

import { getCategoryByIdSchema } from "@Ciri/core/dto/category/get-category-by-id.dto";

import { removeCategorySchema } from "@Ciri/core/dto/category/remove-category.dto";

import { updateCategorySchema } from "@Ciri/core/dto/category/update-category.dto";

import { getCategoryOverviewSchema } from "@Ciri/core/dto/category/get-category-overview.dto";

import { getCategoryOverviewWithDepthSchema } from "@Ciri/core/dto/category/get-category-overview-with-depth.dto";

import { getCategoryTreeSchema } from "@Ciri/core/dto/category/get-category-tree.dto";
import { getContext } from "@Ciri/core/middlewares";
import { CategoryService } from "@Ciri/core/services/category.service";
import { ErrorResponses, sendSuccessResponse } from "@Ciri/core/utils/error-response";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";
import { getValidatedBody, validateBody, getValidatedQuery, validateQuery } from "@Ciri/core/utils/validation";

const router = express.Router();
const categoryService = new CategoryService();

export type CreateCategoryRequestBody = z.infer<typeof createCategorySchema>;
export type CreateCategoryResponseServices = {
      resData: CreateCategoryResponse | null;
      error: string | null;
    };
export type GetCategoryByIdRequestBody = z.infer<typeof getCategoryByIdSchema>;
export type GetCategoryByIdResponseServices = {
      resData: CategoryResponse | null;
      error: string | null;
    };
export type RemoveCategoryRequestBody = z.infer<typeof removeCategorySchema>;
export type RemoveCategoryResponseServices = {
      resData: RemoveCategoryResponse | null;
      error: string | null;
    };
export type UpdateCategoryRequestBody = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryResponseServices = {
      resData: UpdateCategoryResponse | null;
      error: string | null;
    };
export type GetCategoryOverviewRequestQuery = z.infer<typeof getCategoryOverviewSchema>;
export type GetCategoryOverviewResponseServices = {
      resData: GetCategoryOverviewResponse | null;
      error: string | null;
    };
export type GetCategoryOverviewWithDepthRequestQuery = z.infer<typeof getCategoryOverviewWithDepthSchema>;
export type GetCategoryOverviewWithDepthResponseServices = {
      resData: GetCategoryOverviewResponse | null;
      error: string | null;
    };
export type GetCategoryTreeRequestQuery = z.infer<typeof getCategoryTreeSchema>;
export type GetCategoryTreeResponseServices = {
      resData: GetCategoryTreeResponse | null;
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

router.post(
  "/GetCategoryById",
  validateBody<GetCategoryByIdRequestBody>(getCategoryByIdSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<GetCategoryByIdRequestBody>(req);
      const response = await categoryService.GetCategoryById(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<CategoryResponse>(res, 201, response.resData);
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

router.put(
  "/UpdateCategory",
  validateBody<UpdateCategoryRequestBody>(updateCategorySchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<UpdateCategoryRequestBody>(req);
      const response = await categoryService.UpdateCategory(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<UpdateCategoryResponse>(res, 200, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Category UpdateCategory:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.get(
  "/GetCategoryOverview",
  validateQuery<GetCategoryOverviewRequestQuery>(getCategoryOverviewSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedQuery = getValidatedQuery<GetCategoryOverviewRequestQuery>(req);
      const response = await categoryService.GetCategoryOverview(ctx, validatedQuery);
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

router.get(
  "/GetCategoryOverviewWithDepth",
  validateQuery<GetCategoryOverviewWithDepthRequestQuery>(getCategoryOverviewWithDepthSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedQuery = getValidatedQuery<GetCategoryOverviewWithDepthRequestQuery>(req);
      const response = await categoryService.GetCategoryOverviewWithDepth(ctx, validatedQuery);
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
        "Category GetCategoryOverviewWithDepth:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.get(
  "/GetCategoryTree",
  validateQuery<GetCategoryTreeRequestQuery>(getCategoryTreeSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedQuery = getValidatedQuery<GetCategoryTreeRequestQuery>(req);
      const response = await categoryService.GetCategoryTree(ctx, validatedQuery);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<GetCategoryTreeResponse>(res, 200, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Category GetCategoryTree:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

export default router;
