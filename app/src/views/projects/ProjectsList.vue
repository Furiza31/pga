<template>
  <div class="projects-list-page">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">All Projects</h1>
        <button
          @click="navigateToCreate"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          New Project
        </button>
      </div>

      <div class="mb-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="w-full md:w-1/2 mb-4 md:mb-0">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search projects..."
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div class="w-full md:w-auto flex items-center">
            <div class="ml-4">
              <select v-model="sortBy" class="p-2 border rounded">
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
                <option value="deadline">By deadline</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <ProjectsList
        :projects="filteredProjects"
        :loading="loading"
        :showFilters="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectsList from "@/components/projects/ProjectsList.vue";
import { useProjectsStore } from "@/stores/projects";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const projectsStore = useProjectsStore();

// State management
const loading = ref(true);
const searchQuery = ref("");
const showActive = ref(false);
const sortBy = ref("latest");

// Fetch projects on component mount
onMounted(async () => {
  try {
    await projectsStore.fetchAllProjects();
  } finally {
    loading.value = false;
  }
});

// Filter projects based on search and active status
const filteredProjects = computed(() => {
  let filtered = [...projectsStore.projects];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        (project.description &&
          project.description.toLowerCase().includes(query))
    );
  }

  // Filter active projects
  if (showActive.value) {
    const now = new Date();
    filtered = filtered.filter((project) => {
      if (!project.deadline) return true;
      return new Date(project.deadline) > now;
    });
  }

  // Apply sorting
  switch (sortBy.value) {
    case "latest":
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case "oldest":
      filtered.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      break;
    case "deadline":
      filtered.sort((a, b) => {
        // Projects without deadlines come last
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
      break;
  }

  return filtered;
});

// Event handlers
const navigateToCreate = () => {
  router.push("/projects/create");
};
</script>
