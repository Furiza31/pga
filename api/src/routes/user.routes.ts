import express from "express";
import userController from "../controllers/user.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// User routes
router.get("/", authenticate, isAdmin, userController.getAllUsers);
router.get("/:id", authenticate, isAdmin, userController.getUserById);
router.put("/:id", authenticate, isAdmin, userController.updateUser);
router.delete("/:id", authenticate, isAdmin, userController.deleteUser);

export default router;
