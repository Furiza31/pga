import { Request, Response } from "express";
import { z } from "zod";
import forumService from "../services/forum.service";

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

const createThreadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category_id: z
    .number()
    .int()
    .positive("Category ID must be a positive integer"),
});

const createReplySchema = z.object({
  content: z.string().min(1, "Content is required"),
  thread_id: z.number().int().positive("Thread ID must be a positive integer"),
});

const updateReplySchema = z.object({
  content: z.string().min(1, "Content is required"),
});

class ForumController {
  // Categories
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await forumService.getAllCategories();
      return res.json({ categories });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving categories",
      });
    }
  }

  async getCategoryById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const category = await forumService.getCategoryById(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.json({ category });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving category",
      });
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      // Only admin can create categories
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Only administrators can create categories",
        });
      }

      // Validate request body
      const validationResult = createCategorySchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      const category = await forumService.createCategory(req.body);

      return res.status(201).json({
        message: "Category created successfully",
        category,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error creating category",
      });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      // Only admin can update categories
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Only administrators can update categories",
        });
      }

      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      // Validate request body
      const validationResult = createCategorySchema
        .partial()
        .safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      const category = await forumService.updateCategory(id, req.body);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.json({
        message: "Category updated successfully",
        category,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error updating category",
      });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      // Only admin can delete categories
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Only administrators can delete categories",
        });
      }

      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const success = await forumService.deleteCategory(id);

      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.json({
        message: "Category deleted successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error deleting category",
      });
    }
  }

  // Threads
  async getThreadsByCategory(req: Request, res: Response) {
    try {
      const categoryId = parseInt(req.params.categoryId);

      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      // Check if category exists
      const category = await forumService.getCategoryById(categoryId);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const threads = await forumService.getThreadsByCategory(categoryId);

      return res.json({
        category,
        threads,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving threads",
      });
    }
  }

  async getThreadById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid thread ID" });
      }

      const thread = await forumService.getThreadById(id);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      return res.json({ thread });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving thread",
      });
    }
  }

  async createThread(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = createThreadSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      // Check if category exists
      const category = await forumService.getCategoryById(req.body.category_id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const userId = req.user.id;
      const thread = await forumService.createThread(req.body, userId);

      return res.status(201).json({
        message: "Thread created successfully",
        thread,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error creating thread",
      });
    }
  }

  async updateThread(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid thread ID" });
      }

      // Validate request body
      const validationResult = createThreadSchema.partial().safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      // Check if thread exists and if user has permission to update
      const thread = await forumService.getThreadById(id);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      // Only creator or admin can update thread
      if (thread.created_by !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          message: "You do not have permission to update this thread",
        });
      }

      const updatedThread = await forumService.updateThread(id, req.body);

      return res.json({
        message: "Thread updated successfully",
        thread: updatedThread,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error updating thread",
      });
    }
  }

  async deleteThread(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid thread ID" });
      }

      // Check if thread exists and if user has permission to delete
      const thread = await forumService.getThreadById(id);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      // Only creator or admin can delete thread
      if (thread.created_by !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          message: "You do not have permission to delete this thread",
        });
      }

      const success = await forumService.deleteThread(id);

      if (!success) {
        return res.status(404).json({ message: "Thread not found" });
      }

      return res.json({
        message: "Thread deleted successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error deleting thread",
      });
    }
  }

  // Replies
  async createReply(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = createReplySchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      // Check if thread exists
      const thread = await forumService.getThreadById(req.body.thread_id);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      const userId = req.user.id;
      const reply = await forumService.createReply(req.body, userId);

      return res.status(201).json({
        message: "Reply created successfully",
        reply,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error creating reply",
      });
    }
  }

  async updateReply(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reply ID" });
      }

      // Validate request body
      const validationResult = updateReplySchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      // Check if reply exists and if user has permission to update
      const reply = await forumService.getReplyById(id);

      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }

      // Only creator or admin can update reply
      if (reply.created_by !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          message: "You do not have permission to update this reply",
        });
      }

      const updatedReply = await forumService.updateReply(id, req.body.content);

      return res.json({
        message: "Reply updated successfully",
        reply: updatedReply,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error updating reply",
      });
    }
  }

  async deleteReply(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reply ID" });
      }

      // Check if reply exists and if user has permission to delete
      const reply = await forumService.getReplyById(id);

      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }

      // Only creator or admin can delete reply
      if (reply.created_by !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          message: "You do not have permission to delete this reply",
        });
      }

      const success = await forumService.deleteReply(id);

      if (!success) {
        return res.status(404).json({ message: "Reply not found" });
      }

      return res.json({
        message: "Reply deleted successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error deleting reply",
      });
    }
  }
}

export default new ForumController();
