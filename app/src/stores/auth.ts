import { fetchApi } from "@/lib/api";
import { defineStore } from "pinia";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true;
      try {
        const response = await fetchApi<{ token: string; user: User }>(
          "/auth/login",
          {
            method: "POST",
            body: JSON.stringify(credentials),
          }
        );

        this.setUser(response.user);
        this.setToken(response.token);
        return response;
      } finally {
        this.loading = false;
      }
    },

    async register(data: RegisterData) {
      this.loading = true;
      try {
        const response = await fetchApi<{ user: User }>("/auth/register", {
          method: "POST",
          body: JSON.stringify(data),
        });
        return response;
      } finally {
        this.loading = false;
      }
    },

    async fetchCurrentUser() {
      if (!this.token) return null;

      this.loading = true;
      try {
        const response = await fetchApi<{ user: User }>("/auth/me");
        this.setUser(response.user);
        return response.user;
      } catch (error) {
        this.logout();
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setUser(user: User) {
      this.user = user;
    },

    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    async updateUser(user: { name: string; email: string }) {
      if (!this.token) return null;
      this.loading = true;
      try {
        const response = await fetchApi<{ user: User }>("/auth/me", {
          method: "PUT",
          body: JSON.stringify(user),
        });
        return response.user;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
