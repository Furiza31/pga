import express from "express";
import authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Auth routes - wrap controller methods in handler functions
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route
router.get("/me", authenticate, authController.getCurrentUser);
router.put("/me", authenticate, authController.updateUser);

export default router;
