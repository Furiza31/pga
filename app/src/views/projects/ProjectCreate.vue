<template>
  <div class="project-create-page">
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">Create New Project</h1>
        <p class="text-gray-600">
          Create a new project for collaboration with other members.
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <ProjectForm
          :loading="loading"
          @submit="onProjectSubmit"
          @cancel="navigateBack"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectForm from "@/components/projects/ProjectForm.vue";
import { useProjectsStore } from "@/stores/projects";
import { ProjectCreateData, ProjectUpdateData } from "@/types/project";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const projectsStore = useProjectsStore();
const loading = ref(false);

const onProjectSubmit = async (data: ProjectCreateData | ProjectUpdateData) => {
  loading.value = true;
  try {
    const createData = data as ProjectCreateData;
    const project = await projectsStore.createProject(createData);
    router.push(`/projects/${project.id}`);
  } catch (error) {
    console.error("Error creating project:", error);
  } finally {
    loading.value = false;
  }
};

const navigateBack = () => {
  router.push("/projects");
};
</script>
