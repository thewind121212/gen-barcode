import express from "express";

import type MessageResponse from "../interfaces/message-response.js";
import { handlerCheckToken } from "../middlewares.js";
import storeRoutes from "./store/store.routes.js";


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
