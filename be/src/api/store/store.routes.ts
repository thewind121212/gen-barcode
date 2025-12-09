import express from "express";
import Session from "supertokens-node/recipe/session";

import { StoreService } from "../../services/store.service.js";
import { LogLevel, LogType, UnitLogger } from "../../utils/logger.js";
import { validateBody } from "../../utils/validation.js";
import { createStoreSchema } from "../../dto/store.dto.js";
import { ErrorResponses, sendSuccessResponse } from "../../utils/errorResponse.js";

const router = express.Router();
const storeService = new StoreService();

router.post(
  "/createStore",
  validateBody(createStoreSchema),
  async (req, res, next) => {
    try {
      const session = await Session.getSession(req, res);
      const userId = session.getUserId();

      const { name } = (req as any).validatedBody;

      const { storeId, error } = await storeService.CreateStore(userId, name);
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
