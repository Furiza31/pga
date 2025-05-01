<template>
  <div class="project-edit-page">
    <div v-if="loading" class="container mx-auto px-4 py-12 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
      ></div>
      <p class="mt-2 text-gray-600">Loading project...</p>
    </div>

    <div v-else-if="!project" class="container mx-auto px-4 py-12 text-center">
      <div class="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        <p class="font-medium">Project not found</p>
        <p class="mt-2">
          The requested project could not be found or you don't have permission
          to edit it.
        </p>
      </div>
      <button
        @click="navigateBack"
        class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Return to Projects
      </button>
    </div>

    <div v-else class="container mx-auto px-4 py-8 max-w-3xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">
          Edit Project: {{ project.title }}
        </h1>
        <p class="text-gray-600">Update project details and settings.</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <ProjectForm
          :project="project"
          :isEditing="true"
          :loading="updating"
          @submit="updateProject"
          @cancel="navigateToProject"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectForm from "@/components/projects/ProjectForm.vue";
import { useAuthStore } from "@/stores/auth";
import { useProjectsStore } from "@/stores/projects";
import { ProjectUpdateData } from "@/types/project";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const projectsStore = useProjectsStore();
const authStore = useAuthStore();

const loading = ref(true);
const updating = ref(false);

const projectId = computed(() => parseInt(route.params.id as string));

const project = computed(() => projectsStore.currentProject);

const hasEditPermission = computed(() => {
  if (!project.value || !authStore.user) return false;

  if (authStore.user.role === "admin") return true;

  return project.value.created_by === authStore.user.id;
});

// Fetch project data
onMounted(async () => {
  loading.value = true;
  try {
    await projectsStore.fetchProjectById(projectId.value);

    if (!hasEditPermission.value) {
      router.push(`/projects/${projectId.value}`);
    }
  } catch (error) {
    console.error("Error fetching project:", error);
  } finally {
    loading.value = false;
  }
});

// Update project
const updateProject = async (projectData: ProjectUpdateData) => {
  if (!projectId.value) return;

  updating.value = true;
  try {
    await projectsStore.updateProject(projectId.value, projectData);
    router.push(`/projects/${projectId.value}`);
  } catch (error) {
    console.error("Error updating project:", error);
  } finally {
    updating.value = false;
  }
};

const navigateBack = () => {
  router.push("/projects");
};

const navigateToProject = () => {
  router.push(`/projects/${projectId.value}`);
};
</script>
