import express from "express";
import { getSupplierNames } from '../../3rd/suppliers'
import { ItemDetail } from '../../3rd/types/item.types'

const router = express.Router();


router.get<object, any>("/getSupplier", async (req, res) => {
    try {
        const supplier = await getSupplierNames();

        return res.json(supplier)
    } catch (error) {
        return res.status(400).json({ error: "Bad Request" });
    }
});

export default router