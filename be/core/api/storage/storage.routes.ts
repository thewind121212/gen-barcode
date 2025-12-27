import type { z } from "zod";

import express from "express";

import type { CreateStorageResponse, GetStorageByStoreIdOverviewResponse, GetStorageByStoreIdResponse, RemoveStorageResponse, StorageResponse, UpdateStorageResponse } from "@Ciri/types/storage";

import { createStorageSchema } from "@Ciri/core/dto/storage/create-storage.dto";

import { getStorageByIdSchema } from "@Ciri/core/dto/storage/get-storage-by-id.dto";

import { getStorageByStoreIdSchema } from "@Ciri/core/dto/storage/get-storage-by-store-id.dto";

import { getStorageByStoreIdOverviewSchema } from "@Ciri/core/dto/storage/get-storage-by-store-id-overview.dto";

import { updateStorageSchema } from "@Ciri/core/dto/storage/update-storage.dto";

import { removeStorageSchema } from "@Ciri/core/dto/storage/remove-storage.dto";
import { getContext } from "@Ciri/core/middlewares";
import { StorageService } from "@Ciri/core/services/storage.service";
import { ErrorResponses, sendSuccessResponse } from "@Ciri/core/utils/error-response";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";
import { getValidatedBody, validateBody, getValidatedQuery, validateQuery } from "@Ciri/core/utils/validation";

const router = express.Router();
const storageService = new StorageService();

export type CreateStorageRequestBody = z.infer<typeof createStorageSchema>;
export type CreateStorageResponseServices = {
      resData: CreateStorageResponse | null;
      error: string | null;
    };
export type GetStorageByIdRequestQuery = z.infer<typeof getStorageByIdSchema>;
export type GetStorageByIdResponseServices = {
      resData: StorageResponse | null;
      error: string | null;
    };
export type GetStorageByStoreIdRequestQuery = z.infer<typeof getStorageByStoreIdSchema>;
export type GetStorageByStoreIdResponseServices = {
      resData: GetStorageByStoreIdResponse | null;
      error: string | null;
    };
export type GetStorageByStoreIdOverviewRequestQuery = z.infer<typeof getStorageByStoreIdOverviewSchema>;
export type GetStorageByStoreIdOverviewResponseServices = {
      resData: GetStorageByStoreIdOverviewResponse | null;
      error: string | null;
    };
export type UpdateStorageRequestBody = z.infer<typeof updateStorageSchema>;
export type UpdateStorageResponseServices = {
      resData: UpdateStorageResponse | null;
      error: string | null;
    };
export type RemoveStorageRequestBody = z.infer<typeof removeStorageSchema>;
export type RemoveStorageResponseServices = {
      resData: RemoveStorageResponse | null;
      error: string | null;
    };

router.post(
  "/CreateStorage",
  validateBody<CreateStorageRequestBody>(createStorageSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<CreateStorageRequestBody>(req);
      const response = await storageService.CreateStorage(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<CreateStorageResponse>(res, 201, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Storage CreateStorage:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.get(
  "/GetStorageById",
  validateQuery<GetStorageByIdRequestQuery>(getStorageByIdSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedQuery = getValidatedQuery<GetStorageByIdRequestQuery>(req);
      const response = await storageService.GetStorageById(ctx, validatedQuery);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<StorageResponse>(res, 200, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Storage GetStorageById:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.get(
  "/GetStorageByStoreId",
  validateQuery<GetStorageByStoreIdRequestQuery>(getStorageByStoreIdSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedQuery = getValidatedQuery<GetStorageByStoreIdRequestQuery>(req);
      const response = await storageService.GetStorageByStoreId(ctx, validatedQuery);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<GetStorageByStoreIdResponse>(res, 200, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Storage GetStorageByStoreId:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.get(
  "/GetStorageByStoreIdOverview",
  validateQuery<GetStorageByStoreIdOverviewRequestQuery>(getStorageByStoreIdOverviewSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedQuery = getValidatedQuery<GetStorageByStoreIdOverviewRequestQuery>(req);
      const response = await storageService.GetStorageByStoreIdOverview(ctx, validatedQuery);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<GetStorageByStoreIdOverviewResponse>(res, 200, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Storage GetStorageByStoreIdOverview:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.put(
  "/UpdateStorage",
  validateBody<UpdateStorageRequestBody>(updateStorageSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<UpdateStorageRequestBody>(req);
      const response = await storageService.UpdateStorage(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<UpdateStorageResponse>(res, 200, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Storage UpdateStorage:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.post(
  "/RemoveStorage",
  validateBody<RemoveStorageRequestBody>(removeStorageSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<RemoveStorageRequestBody>(req);
      const response = await storageService.RemoveStorage(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<RemoveStorageResponse>(res, 201, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Storage RemoveStorage:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

export default router;
