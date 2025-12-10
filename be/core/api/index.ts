import express from "express";

import type MessageResponse from "@Ciri/core/interfaces/message-response";

import storeRoutes from "@Ciri/core/api/store/store.routes";
import { handlerCheckToken } from "@Ciri/core/middlewares";

const router = express.Router();

router.get<object, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

// All API routes below here require a valid session and will have `userId` on the request
router.use(handlerCheckToken);

router.use("/store", storeRoutes);

export default router;
