import { Router } from "express";
import {
  getOrders,
  createOrder,
  getOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/verifyMiddleware.js";
import { authorizationMWare } from "../middlewares/authorizationMiddleware.js";

const router = Router();

router.route("/orders").all(verifyToken).get(getOrders).post(createOrder);
router
  .route("/orders/:orderId")
  .patch(verifyToken, authorizationMWare, updateOrderStatus)
  .get(getOrder);

export default router;
