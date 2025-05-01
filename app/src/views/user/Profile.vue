<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
    <UserProfile v-if="authStore.user" :user="authStore.user" />
    <div v-else class="text-gray-600">Loading profile...</div>
  </div>
</template>

<script setup lang="ts">
import UserProfile from "@/components/UserProfile.vue";
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";

const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchCurrentUser();
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  }
});
</script>
