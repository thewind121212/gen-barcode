import express from "express";

import type MessageResponse from "../interfaces/message-response.js";
import storeRoutes from "./store/store.routes.js";


const router = express.Router();

router.get<object, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/store", storeRoutes);

export default router;
