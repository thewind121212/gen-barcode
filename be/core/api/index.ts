import express from "express";

import type MessageResponse from "@Ciri/core/interfaces/message-response";

import categoryRoutes from "@Ciri/core/api/category/category.routes";
import storageRoutes from "@Ciri/core/api/storage/storage.routes";
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
router.use("/category", categoryRoutes);
router.use("/storage", storageRoutes);
export default router;
