import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

import erp from './erp/index.js'

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/erp", erp)

export default router;
