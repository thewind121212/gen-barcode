import express from "express";

import erp from "./products.js";
import supplier from "./supplier.js";

const router = express.Router();

router.use("/", erp);
router.use("/", supplier);

export default router;
