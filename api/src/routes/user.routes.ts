import express from "express";
import userController from "../controllers/user.controller";
import { isAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// User routes
router.get("/", isAdmin, userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
