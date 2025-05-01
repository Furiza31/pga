<template>
  <div class="projects-list">
    <div v-if="loading" class="text-center py-10">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
      ></div>
      <p class="mt-2 text-gray-600">Loading projects...</p>
    </div>

    <div v-else-if="projects.length === 0" class="text-center py-10">
      <div class="text-gray-500">
        <p class="text-xl mb-2">No projects found</p>
        <p class="mb-4" v-if="isMyProjects">
          You haven't created or joined any projects yet.
        </p>
        <p class="mb-4" v-else>
          There are no projects available at the moment.
        </p>
        <button
          @click="navigateToCreateProject"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create New Project
        </button>
      </div>
    </div>

    <div v-else>
      <div v-if="showFilters" class="mb-6">
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          />
        </div>

        <div class="flex items-center mb-4">
          <label class="mr-4">
            <input
              type="checkbox"
              v-model="showOnlyActive"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
            Show only active projects
          </label>
        </div>
      </div>

      <div v-for="project in filteredProjects" :key="project.id" class="mb-5">
        <ProjectCard :project="project" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Project } from "@/types/project";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import ProjectCard from "./ProjectCard.vue";

const props = defineProps<{
  projects: Project[];
  loading: boolean;
  isMyProjects?: boolean;
  showFilters?: boolean;
}>();

const router = useRouter();
const searchQuery = ref("");
const showOnlyActive = ref(false);

// Filter projects based on search query and active status
const filteredProjects = computed(() => {
  let filtered = props.projects;

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

  // Filter active projects (those with future deadlines or no deadline)
  if (showOnlyActive.value) {
    const now = new Date();
    filtered = filtered.filter((project) => {
      if (!project.deadline) return true;
      return new Date(project.deadline) > now;
    });
  }

  return filtered;
});

const navigateToCreateProject = () => {
  router.push("/projects/create");
};
</script>
