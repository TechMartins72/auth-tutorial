import { Router } from "express";
import {
  login,
  register,
  getUser,
  updateUserInfo,
  updatePassword,
  deleteUser,
  getTotalOrder,
} from "../controllers/usersControllers.js";
import { verifyToken } from "../middlewares/verifyMiddleware.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/users/getme", verifyToken, getUser);
router
  .route("/users/:userId")
  .patch(verifyToken, updateUserInfo)
  .delete(verifyToken, deleteUser)
  .get(verifyToken, getTotalOrder);
router.put("/users/password/:userId", verifyToken, updatePassword);

export default router;
