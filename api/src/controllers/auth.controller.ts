import { Request, Response } from "express";
import { z } from "zod";
import authService from "../services/auth.service";

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

class AuthController {
  // Register a new user
  async register(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = registerSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      // Register user
      const user = await authService.register(req.body);

      return res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Error registering user",
      });
    }
  }

  // Login user
  async login(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = loginSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      // Login user
      const { token, user } = await authService.login(req.body);

      return res.json({
        message: "Login successful",
        token,
        user,
      });
    } catch (error: any) {
      return res.status(401).json({
        message: error.message || "Error logging in",
      });
    }
  }

  // Get current user information (requires authentication)
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      return res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Error getting current user",
      });
    }
  }
}

export default new AuthController();
