import { Router } from "express";
import protect from "../middlewares/protect.js";
import * as dashboardController from "../controllers/dashboard.controller.js";
import * as transactionController from "../controllers/transaction.controller.js";

const router = Router();

router.get(
    "/",
    protect,
    dashboardController.getDashboard
);

router.get(
    "/transactions",
    protect,
    transactionController.getTransactions
);

export default router;