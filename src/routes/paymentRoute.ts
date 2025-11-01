import { Router } from "express";
import { initializeTransaction } from "../controllers/paymentControllers.js";
import { verifyPayment } from "../controllers/paymentControllers.js";

const router = Router();

router.post("/api/payment", initializeTransaction);

router.get("/api/verifypayment/:reference", verifyPayment);

export default router;
