import express from "express";

import type MessageResponse from "@Ciri/interfaces/message-response";

import { handlerCheckToken } from "@Ciri/middlewares";
import storeRoutes from "@Ciri/api/store/store.routes";

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
