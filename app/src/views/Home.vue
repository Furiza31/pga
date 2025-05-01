<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2">
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            Welcome, {{ authStore.user?.name }}
          </h2>
          <p class="text-gray-600">
            This is your dashboard where you can access all the features of our
            application.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentProjects :limit="4" />
          <RecentThreads :limit="4" />
        </div>
      </div>

      <div>
        <UpcomingEvents :limit="5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UpcomingEvents from "@/components/events/UpcomingEvents.vue";
import RecentThreads from "@/components/forum/RecentThreads.vue";
import RecentProjects from "@/components/projects/RecentProjects.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
</script>
