<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-bold text-gray-900">PGA</h1>
        <div class="flex items-center space-x-4">
          <nav class="flex space-x-4">
            <router-link to="/" class="text-gray-700 hover:text-gray-900">
              Home
            </router-link>
            <router-link to="/events" class="text-gray-700 hover:text-gray-900">
              Events
            </router-link>
            <router-link
              to="/projects"
              class="text-gray-700 hover:text-gray-900"
            >
              Projects
            </router-link>
            <router-link to="/forum" class="text-gray-700 hover:text-gray-900">
              Forum
            </router-link>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/projects/my-projects"
              class="text-gray-700 hover:text-gray-900"
            >
              My Projects
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin/users"
              class="text-gray-700 hover:text-gray-900"
            >
              Users
            </router-link>
          </nav>
          <UserMenu v-if="authStore.isAuthenticated" />
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import UserMenu from "@/components/UserMenu.vue";
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  try {
    if (authStore.token && !authStore.user) {
      await authStore.fetchCurrentUser();
    }
  } catch (error) {
    router.push({ name: "login" });
  }
});
</script>
