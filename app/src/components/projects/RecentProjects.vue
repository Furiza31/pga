<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Recent Projects
      </h3>
    </div>

    <div v-if="loading" class="p-6 text-center">
      <div class="text-gray-600">Loading projects...</div>
    </div>

    <div v-else-if="projects.length === 0" class="p-6 text-center">
      <div class="text-gray-600">No projects available</div>
    </div>

    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="project in projects"
        :key="project.id"
        class="px-4 py-4 sm:px-6 hover:bg-gray-50"
      >
        <div class="flex items-center justify-between">
          <router-link :to="`/projects/${project.id}`" class="block flex-grow">
            <p class="text-sm font-medium text-blue-600 truncate">
              {{ project.title }}
            </p>
            <div class="mt-1 flex items-center text-xs text-gray-500">
              <p v-if="project.creator_name">By: {{ project.creator_name }}</p>
              <p class="ml-1" v-if="project.deadline">
                <span class="mx-1">•</span>Due:
                {{ formatDate(project.deadline) }}
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
      <router-link
        to="/projects"
        class="text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        View all projects <span aria-hidden="true">&rarr;</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from "@/stores/projects";
import type { Project } from "@/types/project";
import { onMounted, ref } from "vue";

const props = defineProps({
  limit: {
    type: Number,
    default: 5,
  },
});

const projectsStore = useProjectsStore();
const projects = ref<Project[]>([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    await projectsStore.fetchAllProjects();
    // Sort by most recent and limit the number
    projects.value = [...projectsStore.projects]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, props.limit);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
</script>
