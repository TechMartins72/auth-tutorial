import { Router } from "express";
import {
  deleteProduct,
  postProduct,
  getProduct,
  getProducts,
} from "../controllers/productsControllers.js";
import { verifyToken } from "../middlewares/verifyMiddleware.js";
import { authorizationMWare } from "../middlewares/authorizationMiddleware.js";

const router = Router();

// router.get("/products", getProducts);
router
  .route("/products")
  .get(getProducts)
  .post(verifyToken, authorizationMWare, postProduct);
router
  .route("/products/:productId")
  .get(getProduct)
  .delete(verifyToken, authorizationMWare, deleteProduct);

export default router;
