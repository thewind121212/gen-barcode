import type { z } from "zod";

import express from "express";

import type { CreateStoreResponse, GetUserInfoResponse } from "@Ciri/types/store";

import { createStoreSchema } from "@Ciri/core/dto/store/create-store.dto";
import { getUserInfoSchema } from "@Ciri/core/dto/store/get-user-info.dto";
import { getContext } from "@Ciri/core/middlewares";
import { StoreService } from "@Ciri/core/services/store.service";
import { ErrorResponses, sendSuccessResponse } from "@Ciri/core/utils/error-response";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";
import { getValidatedBody, validateBody } from "@Ciri/core/utils/validation";

const router = express.Router();
const storeService = new StoreService();

export type CreateStoreRequestBody = z.infer<typeof createStoreSchema>;
export type CreateStoreResponseServices = CreateStoreResponse & {
  error: string | null;
};
export type GetUserInfoRequestBody = z.infer<typeof getUserInfoSchema>;
export type GetUserInfoResponseServices = GetUserInfoResponse & {
  error: string | null;
};

router.post(
  "/CreateStore",
  validateBody<CreateStoreRequestBody>(createStoreSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<CreateStoreRequestBody>(req);
      const response = await storeService.CreateStore(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      sendSuccessResponse<CreateStoreResponse>(res, 201, response);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Store CreateStore:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.post(
  "/GetUserInfo",
  validateBody<GetUserInfoRequestBody>(getUserInfoSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<GetUserInfoRequestBody>(req);
      const response = await storeService.GetUserInfo(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      sendSuccessResponse<GetUserInfoResponse>(res, 201, response);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Store GetUserInfo:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

export default router;
