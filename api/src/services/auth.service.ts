import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { LoginUserDTO, User } from "../models/user.model";
import userService from "./user.service";

class AuthService {
  // Login user
  async login(
    credentials: LoginUserDTO
  ): Promise<{ token: string; user: any }> {
    // Find user by email
    const user = await userService.getUserByEmail(credentials.email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Return token and user info (without password)
    const { password, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  // Register new user
  async register(userData: any) {
    return userService.createUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: "member", // Default role for new users
    });
  }

  // Generate JWT token
  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Cast both secret and options to any to bypass TypeScript's strict typing
    return jwt.sign(payload, config.jwt.secret as any, {
      expiresIn: config.jwt.expiresIn as any,
    });
  }

  // Verify token
  verifyToken(token: string) {
    return jwt.verify(token, config.jwt.secret as any);
  }
}

export default new AuthService();
