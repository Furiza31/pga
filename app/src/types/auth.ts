export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
