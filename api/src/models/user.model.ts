export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "member";
  created_at: Date;
  updated_at: Date;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "member";
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

// Sanitize user object by removing password before sending to client
export const sanitizeUser = (user: User): UserDTO => {
  const { password, ...userDTO } = user;
  return userDTO as UserDTO;
};
