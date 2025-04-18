import express from "express";
import forumController from "../controllers/forum.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Category routes
router.get("/categories", forumController.getAllCategories);
router.get("/categories/:id", forumController.getCategoryById);
router.post("/categories", authenticate, forumController.createCategory);
router.put("/categories/:id", authenticate, forumController.updateCategory);
router.delete("/categories/:id", authenticate, forumController.deleteCategory);

// Thread routes
router.get(
  "/categories/:categoryId/threads",
  forumController.getThreadsByCategory
);
router.get("/threads/:id", forumController.getThreadById);
router.post("/threads", authenticate, forumController.createThread);
router.put("/threads/:id", authenticate, forumController.updateThread);
router.delete("/threads/:id", authenticate, forumController.deleteThread);

// Reply routes
router.post("/replies", authenticate, forumController.createReply);
router.put("/replies/:id", authenticate, forumController.updateReply);
router.delete("/replies/:id", authenticate, forumController.deleteReply);

export default router;
