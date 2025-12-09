import express from "express";
import Session from "supertokens-node/recipe/session";

import { StoreService } from "../../services/store.service.js";
import { LogLevel, LogType, UnitLogger } from "../../utils/logger.js";
import { validateBody } from "../../utils/validation.js";
import { createStoreSchema } from "../../dto/store.dto.js";

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

      const store = await storeService.createStore(userId, name);
      res.status(201).json(store);
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
