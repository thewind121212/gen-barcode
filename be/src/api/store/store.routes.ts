import express from "express";
import { StoreService } from "../../services/store.service.js";
import Session from "supertokens-node/recipe/session";

const router = express.Router();
const storeService = new StoreService();

router.post("/createStore", async (req, res, next) => {
    try {
        // const session = await Session.getSession(req, res);
        // const userId = session.getUserId();
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ message: "Store name is required" });
            return;
        }

        const store = await storeService.createStore("1", name);
        res.status(201).json(store);
    } catch (error) {
        next(error);
    }
});

export default router;
