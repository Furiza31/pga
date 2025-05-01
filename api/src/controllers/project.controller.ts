import { Request, Response } from "express";
import { z } from "zod";
import projectService from "../services/project.service";

// Validation schemas
const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  deadline: z.string().or(z.date()).optional().nullable(),
});

const updateProjectSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().nullable().optional(),
  deadline: z.string().or(z.date()).nullable().optional(),
});

const memberActionSchema = z.object({
  userId: z.number().int().positive("User ID must be a positive integer"),
});

class ProjectController {
  // Get all projects
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await projectService.getAllProjects();
      return res.json({ projects });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving projects",
      });
    }
  }

  // Get my projects (projects where the user is a member or creator)
  async getMyProjects(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const projects = await projectService.getProjectsByUserId(userId);
      return res.json({ projects });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving your projects",
      });
    }
  }

  // Get project by ID
  async getProjectById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const project = await projectService.getProjectById(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      return res.json({ project });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving project",
      });
    }
  }

  // Create new project
  async createProject(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = createProjectSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      const userId = req.user.id;
      const project = await projectService.createProject(req.body, userId);

      return res.status(201).json({
        message: "Project created successfully",
        project,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error creating project",
      });
    }
  }

  // Update project
  async updateProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      // Validate request body
      const validationResult = updateProjectSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      // Check if project exists and if user has permission to update
      const existingProject = await projectService.getProjectById(id);

      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Only creator or admin can update project
      if (
        existingProject.created_by !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "You do not have permission to update this project",
        });
      }

      const updatedProject = await projectService.updateProject(id, req.body);

      return res.json({
        message: "Project updated successfully",
        project: updatedProject,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error updating project",
      });
    }
  }

  // Delete project
  async deleteProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      // Check if project exists and if user has permission to delete
      const existingProject = await projectService.getProjectById(id);

      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Only creator or admin can delete project
      if (
        existingProject.created_by !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "You do not have permission to delete this project",
        });
      }

      const success = await projectService.deleteProject(id);

      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }

      return res.json({ message: "Project deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error deleting project",
      });
    }
  }

  // Get project members
  async getProjectMembers(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      // Check if project exists
      const existingProject = await projectService.getProjectById(id);

      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      const members = await projectService.getProjectMembers(id);

      return res.json({ members });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving project members",
      });
    }
  }

  // Add member to project
  async addProjectMember(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);

      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      // Validate request body
      const validationResult = memberActionSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      const { userId } = req.body;

      // Check if project exists and if user has permission to add members
      const existingProject = await projectService.getProjectById(projectId);

      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Only creator or admin can add members
      if (
        existingProject.created_by !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "You do not have permission to add members to this project",
        });
      }

      const success = await projectService.addProjectMember(projectId, userId);

      if (!success) {
        return res.status(400).json({
          message: "Failed to add member to project",
        });
      }

      return res.json({
        message: "Member added to project successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error adding member to project",
      });
    }
  }

  // Remove member from project
  async removeProjectMember(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);
      const userId = parseInt(req.params.userId);

      if (isNaN(projectId) || isNaN(userId)) {
        return res.status(400).json({
          message: "Invalid project ID or user ID",
        });
      }

      // Check if project exists and if user has permission to remove members
      const existingProject = await projectService.getProjectById(projectId);

      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Only creator or admin can remove members (or the member themselves)
      if (
        existingProject.created_by !== req.user.id &&
        req.user.id !== userId &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message:
            "You do not have permission to remove members from this project",
        });
      }

      const success = await projectService.removeProjectMember(
        projectId,
        userId
      );

      if (!success) {
        return res.status(400).json({
          message: "Failed to remove member from project",
        });
      }

      return res.json({
        message: "Member removed from project successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error removing member from project",
      });
    }
  }

  // Search users
  async searchUsers(req: Request, res: Response) {
    try {
      const query = req.params.query;

      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      const users = await projectService.searchUsers(query);

      return res.json({ users });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error searching users",
      });
    }
  }
}

export default new ProjectController();
