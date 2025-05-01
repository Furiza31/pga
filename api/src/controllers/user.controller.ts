import { Request, Response } from "express";
import { z } from "zod";
import userService from "../services/user.service";

// Validation schemas
const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["admin", "member"]).optional(),
});

class UserController {
  // Get all users (admin only)
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      return res.json({ users });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving users",
      });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ user });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving user",
      });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Check if user is updating their own profile or is an admin
      if (req.user.id !== id && req.user.role !== "admin") {
        return res.status(403).json({
          message: "You do not have permission to update this user",
        });
      }

      // Validate request body
      const validationResult = updateUserSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      // Regular users cannot change their role
      if (req.body.role && req.user.role !== "admin") {
        return res.status(403).json({
          message: "You do not have permission to change role",
        });
      }

      const updatedUser = await userService.updateUser(id, req.body);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error updating user",
      });
    }
  }

  // Delete user (admin only or own account)
  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Check if user is deleting their own profile or is an admin
      if (req.user.id !== id && req.user.role !== "admin") {
        return res.status(403).json({
          message: "You do not have permission to delete this user",
        });
      }

      const success = await userService.deleteUser(id);

      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error deleting user",
      });
    }
  }
}

export default new UserController();
