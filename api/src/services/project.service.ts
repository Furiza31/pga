import db from "../db";
import {
  CreateProjectDTO,
  Project,
  ProjectWithMembers,
  UpdateProjectDTO,
} from "../models/project.model";

class ProjectService {
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    const result = await db.query(`
      SELECT p.*, u.name as creator_name
      FROM projects p
      JOIN users u ON p.created_by = u.id
      ORDER BY p.created_at DESC
    `);
    return result.rows;
  }

  // Get project by ID
  async getProjectById(id: number): Promise<ProjectWithMembers | null> {
    // First, get the project details
    const projectResult = await db.query(
      `
      SELECT p.*, u.name as creator_name
      FROM projects p
      JOIN users u ON p.created_by = u.id
      WHERE p.id = $1
    `,
      [id]
    );

    if (projectResult.rows.length === 0) {
      return null;
    }

    const project = projectResult.rows[0] as Project;

    // Then, get the project members
    const membersResult = await db.query(
      `
      SELECT pm.user_id
      FROM project_members pm
      WHERE pm.project_id = $1
    `,
      [id]
    );

    const memberIds = membersResult.rows.map((row) => row.user_id);

    return {
      ...project,
      members: memberIds,
    };
  }

  // Get projects by user ID (projects where user is a member or creator)
  async getProjectsByUserId(userId: number): Promise<Project[]> {
    const result = await db.query(
      `
      SELECT DISTINCT p.*, u.name as creator_name
      FROM projects p
      JOIN users u ON p.created_by = u.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      WHERE p.created_by = $1 OR pm.user_id = $1
      ORDER BY p.created_at DESC
    `,
      [userId]
    );

    return result.rows;
  }

  // Create new project
  async createProject(
    projectData: CreateProjectDTO,
    userId: number
  ): Promise<Project> {
    // Start a transaction
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // Create the project
      const projectResult = await client.query(
        `
        INSERT INTO projects (
          title, 
          description, 
          deadline, 
          created_by
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
        [
          projectData.title,
          projectData.description || null,
          projectData.deadline || null,
          userId,
        ]
      );

      const project = projectResult.rows[0] as Project;

      // Add the creator as a project member
      await client.query(
        `
        INSERT INTO project_members (project_id, user_id)
        VALUES ($1, $2)
      `,
        [project.id, userId]
      );

      await client.query("COMMIT");
      return project;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Update project
  async updateProject(
    id: number,
    projectData: UpdateProjectDTO
  ): Promise<Project | null> {
    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (projectData.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(projectData.title);
    }

    if (projectData.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(projectData.description);
    }

    if (projectData.deadline !== undefined) {
      updates.push(`deadline = $${paramCount++}`);
      values.push(projectData.deadline);
    }

    // Add update timestamp
    updates.push(`updated_at = NOW()`);

    // If no fields to update
    if (updates.length === 1) {
      const currentProject = await this.getProjectById(id);
      return currentProject as Project;
    }

    // Add ID as the last parameter
    values.push(id);

    const query = `
      UPDATE projects 
      SET ${updates.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as Project;
  }

  // Delete project
  async deleteProject(id: number): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows.length > 0;
  }

  // Add member to project
  async addProjectMember(projectId: number, userId: number): Promise<boolean> {
    try {
      await db.query(
        `
        INSERT INTO project_members (project_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, user_id) DO NOTHING
      `,
        [projectId, userId]
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  // Remove member from project
  async removeProjectMember(
    projectId: number,
    userId: number
  ): Promise<boolean> {
    const result = await db.query(
      `
      DELETE FROM project_members
      WHERE project_id = $1 AND user_id = $2
      RETURNING *
    `,
      [projectId, userId]
    );

    return result.rows.length > 0;
  }

  // Get project members
  async getProjectMembers(projectId: number): Promise<any[]> {
    const result = await db.query(
      `
      SELECT u.id, u.name, u.email, pm.joined_at
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
      ORDER BY pm.joined_at ASC
    `,
      [projectId]
    );

    return result.rows;
  }

  // Search users by name or email
  async searchUsers(query: string): Promise<any[]> {
    const result = await db.query(
      `
      SELECT id, name, email
      FROM users
      WHERE name ILIKE $1 OR email ILIKE $1
      ORDER BY name ASC
    `,
      [`%${query}%`]
    );

    return result.rows;
  }
}

export default new ProjectService();
