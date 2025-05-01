<template>
  <div class="my-projects-page">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">My Projects</h1>
        <button
          @click="navigateToCreate"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          New Project
        </button>
      </div>

      <div v-if="loading" class="text-center py-10">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="mt-2 text-gray-600">Loading your projects...</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <div class="md:col-span-8">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search my projects..."
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              @input="onSearch"
            />
          </div>

          <div class="md:col-span-4">
            <div class="flex items-center">
              <div class="ml-auto">
                <select
                  v-model="sortBy"
                  class="p-2 border rounded"
                  @change="onSortChange"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="filteredProjects.length === 0"
          class="text-center py-8 rounded"
        >
          <p class="text-xl mb-3 text-gray-700">No projects found</p>
          <p class="mb-4 text-gray-500">
            You haven't created or joined any projects matching your criteria.
          </p>
          <button
            @click="navigateToCreate"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create Your First Project
          </button>
        </div>

        <div v-else>
          <h2 class="text-xl font-semibold mb-4">Projects I Created</h2>
          <div
            v-if="projectsICreated.length === 0"
            class="mb-6 text-gray-500 text-center py-4 bg-gray-50 rounded"
          >
            <p>You haven't created any projects yet.</p>
          </div>
          <div v-else class="mb-8">
            <div
              v-for="project in projectsICreated"
              :key="project.id"
              class="mb-5"
            >
              <ProjectCard :project="project" />
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-4">Projects I'm a Member Of</h2>
          <div
            v-if="projectsImMemberOf.length === 0"
            class="mb-6 text-gray-500 text-center py-4 bg-gray-50 rounded"
          >
            <p>You're not a member of any projects yet.</p>
          </div>
          <div v-else>
            <div
              v-for="project in projectsImMemberOf"
              :key="project.id"
              class="mb-5"
            >
              <ProjectCard :project="project" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectCard from "@/components/projects/ProjectCard.vue";
import { useAuthStore } from "@/stores/auth";
import { useProjectsStore } from "@/stores/projects";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const projectsStore = useProjectsStore();
const authStore = useAuthStore();

// State
const loading = ref(true);
const searchQuery = ref("");
const showActive = ref(false);
const sortBy = ref("latest");

// Fetch projects on component mount
onMounted(async () => {
  try {
    await projectsStore.fetchMyProjects();
  } finally {
    loading.value = false;
  }
});

// Filter and sort projects
const filteredProjects = computed(() => {
  let filtered = [...projectsStore.myProjects];

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

// Separate projects I created vs those I'm a member of
const projectsICreated = computed(() => {
  if (!authStore.user) return [];
  return filteredProjects.value.filter(
    (project) => project.created_by === authStore.user?.id
  );
});

const projectsImMemberOf = computed(() => {
  if (!authStore.user) return [];
  return filteredProjects.value.filter(
    (project) => project.created_by !== authStore.user?.id
  );
});

// Event handlers
const navigateToCreate = () => {
  router.push("/projects/create");
};

const onSearch = () => {
  // The computed filteredProjects will update automatically
};

const onFilterChange = () => {
  // The computed filteredProjects will update automatically
};

const onSortChange = () => {
  // The computed filteredProjects will update automatically
};
</script>
