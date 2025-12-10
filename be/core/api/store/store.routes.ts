import type { z } from "zod";

import express from "express";

import { createStoreSchema } from "@Ciri/dto/store.dto";
import { getContext } from "@Ciri/middlewares";
import { StoreService } from "@Ciri/services/store.service";
import { ErrorResponses, sendSuccessResponse } from "@Ciri/utils/error-response";
import { LogLevel, LogType, UnitLogger } from "@Ciri/utils/logger";
import { getValidatedBody, validateBody } from "@Ciri/utils/validation";

const router = express.Router();
const storeService = new StoreService();

type CreateStoreRequestBody = z.infer<typeof createStoreSchema>;

router.post(
  "/createStore",
  validateBody<CreateStoreRequestBody>(createStoreSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const { name } = getValidatedBody<CreateStoreRequestBody>(req);
      const { storeId, error } = await storeService.CreateStore(ctx, name);
      if (error) {
        ErrorResponses.badRequest(res, error);
        return;
      }
      sendSuccessResponse<{ storeId: string }>(res, 201, { storeId: storeId! });
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Store Create:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

export default router;
