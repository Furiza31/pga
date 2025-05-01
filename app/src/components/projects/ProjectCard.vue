<template>
  <div class="project-card p-4 border rounded shadow-sm mb-4">
    <h3 class="text-xl font-bold mb-2">{{ project.title }}</h3>

    <p v-if="project.description" class="text-gray-700 mb-3">
      {{ project.description }}
    </p>
    <p v-else class="text-gray-500 italic mb-3">No description provided</p>

    <div class="flex justify-between items-center text-sm text-gray-600 mb-3">
      <div>
        <span class="font-medium">Created:</span>
        {{ formatDate(project.created_at) }}
      </div>
      <div v-if="project.deadline">
        <span class="font-medium">Deadline:</span>
        <span :class="isDeadlineSoon ? 'text-orange-600 font-bold' : ''">
          {{ formatDate(project.deadline) }}
        </span>
      </div>
    </div>

    <div class="flex justify-end mt-2">
      <button
        @click="viewProject"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm mr-2"
      >
        View Details
      </button>
      <button
        v-if="isCreator || isAdmin"
        @click="editProject"
        class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
      >
        Edit
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { Project } from "@/types/project";
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  project: Project;
}>();

const router = useRouter();
const authStore = useAuthStore();

// Check if the current user is the creator of the project or an admin
const isCreator = computed(() => {
  return authStore.user?.id === props.project.created_by;
});

const isAdmin = computed(() => {
  return authStore.user?.role === "admin";
});

// Check if deadline is within the next 7 days
const isDeadlineSoon = computed(() => {
  if (!props.project.deadline) return false;

  const deadlineDate = new Date(props.project.deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 && diffDays <= 7;
});

// Format date to be more readable
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Navigation functions
const viewProject = () => {
  router.push(`/projects/${props.project.id}`);
};

const editProject = () => {
  router.push(`/projects/${props.project.id}/edit`);
};
</script>
