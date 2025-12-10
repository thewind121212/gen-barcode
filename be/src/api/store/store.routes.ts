import express from "express";

import { z } from "zod";
import { createStoreSchema } from "../../dto/store.dto.js";
import { getContext } from "../../middlewares.js";
import { StoreService } from "../../services/store.service.js";
import { ErrorResponses, sendSuccessResponse } from "../../utils/errorResponse.js";
import { LogLevel, LogType, UnitLogger } from "../../utils/logger.js";
import { getValidatedBody, validateBody } from "../../utils/validation.js";

const router = express.Router();
const storeService = new StoreService();

type CreateStoreRequestBody = z.infer<typeof createStoreSchema>;

router.post(
  "/createStore",
  validateBody<CreateStoreRequestBody>(createStoreSchema),
  async (req, res, next) => {
    try {
      const ctx = getContext(req);
      const { name } = getValidatedBody<CreateStoreRequestBody>(req);
      const { storeId, error } = await storeService.CreateStore(ctx, name);
      if (error) {
        ErrorResponses.badRequest(res, error);
        return;
      }
      sendSuccessResponse(res, 201, { storeId });
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
