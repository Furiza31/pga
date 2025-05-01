import { fetchApi } from "@/lib/api";
import { User } from "@/types/auth";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

interface UsersState {
  users: User[];
  totalUsers: number;
  currentUser: User | null;
  loading: boolean;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersState => ({
    users: [],
    totalUsers: 0,
    currentUser: null,
    loading: false,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await fetchApi<{ users: User[]; total: number }>(
          "/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        this.users = response.users;
        this.totalUsers = response.total;
        return response;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserById(id: number) {
      this.loading = true;
      try {
        const response = await fetchApi<{ user: User }>(`/users/${id}`);
        this.currentUser = response.user;
        return response.user;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: {
      name: string;
      email: string;
      password: string;
    }) {
      this.loading = true;
      try {
        const response = await useAuthStore().register(userData);
        // Refresh users list
        this.fetchUsers();
        return response;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(
      id: number,
      userData: {
        name?: string;
        email?: string;
        password?: string;
        role?: "admin" | "member";
      }
    ) {
      this.loading = true;
      try {
        const response = await fetchApi<{ user: User }>(`/users/${id}`, {
          method: "PUT",
          body: JSON.stringify(userData),
        });

        // Update in local state if this user is in the list
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          this.users[index] = response.user;
        }

        return response;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: number) {
      this.loading = true;
      try {
        await fetchApi(`/users/${id}`, {
          method: "DELETE",
        });

        // Remove from local state
        this.users = this.users.filter((u) => u.id !== id);
        this.totalUsers--;

        return true;
      } finally {
        this.loading = false;
      }
    },
  },
});
