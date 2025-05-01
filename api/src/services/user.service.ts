import bcrypt from "bcrypt";
import db from "../db";
import {
  CreateUserDTO,
  User,
  UserDTO,
  sanitizeUser,
} from "../models/user.model";

class UserService {
  // Get all users
  async getAllUsers(): Promise<UserDTO[]> {
    const result = await db.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );
    return result.rows.map((user) => sanitizeUser(user as User));
  }

  // Get user by ID
  async getUserById(id: number): Promise<UserDTO | null> {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return sanitizeUser(result.rows[0] as User);
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as User;
  }

  // Create new user
  async createUser(userData: CreateUserDTO): Promise<UserDTO> {
    // Check if user already exists
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Set default role to member if not specified
    const role = userData.role || "member";

    const result = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [userData.name, userData.email, hashedPassword, role]
    );

    return sanitizeUser(result.rows[0] as User);
  }

  // Update user
  async updateUser(
    id: number,
    userData: Partial<User>
  ): Promise<UserDTO | null> {
    // Get the current user data
    const currentUser = await this.getUserById(id);

    if (!currentUser) {
      return null;
    }

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.name) {
      updates.push(`name = $${paramCount++}`);
      values.push(userData.name);
    }

    if (userData.email) {
      updates.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }

    if (userData.password) {
      updates.push(`password = $${paramCount++}`);
      values.push(await bcrypt.hash(userData.password, 10));
    }

    if (userData.role) {
      updates.push(`role = $${paramCount++}`);
      values.push(userData.role);
    }

    // Add update timestamp
    updates.push(`updated_at = NOW()`);

    // If no fields to update
    if (updates.length === 1) {
      return currentUser;
    }

    // Add ID as the last parameter
    values.push(id);

    const query = `
      UPDATE users 
      SET ${updates.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await db.query(query, values);

    return sanitizeUser(result.rows[0] as User);
  }

  // Delete user
  async deleteUser(id: number): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows.length > 0;
  }
}

export default new UserService();
