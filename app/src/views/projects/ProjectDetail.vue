<template>
  <div class="project-detail-page">
    <div v-if="loading" class="container mx-auto px-4 py-12 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
      ></div>
      <p class="mt-2 text-gray-600">Loading project details...</p>
    </div>

    <div v-else-if="!project" class="container mx-auto px-4 py-12 text-center">
      <div class="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        <p class="font-medium">Project not found</p>
        <p class="mt-2">
          The requested project could not be found or you don't have permission
          to view it.
        </p>
      </div>
      <button
        @click="navigateToProjects"
        class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Return to Projects
      </button>
    </div>

    <div v-else class="container mx-auto px-4 py-8">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">{{ project.title }}</h1>
          <p class="text-gray-600 mt-1">
            Created by {{ project.creator_name || "Unknown" }} on
            {{ formatDate(project.created_at) }}
          </p>
        </div>

        <div class="flex gap-2" v-if="canManageProject">
          <button
            @click="navigateToEdit"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
            Edit Project
          </button>
          <button
            @click="confirmDeleteProject"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="col-span-2">
            <h2 class="text-xl font-semibold mb-3">Description</h2>
            <div class="text-gray-700">
              <p v-if="project.description">{{ project.description }}</p>
              <p v-else class="text-gray-500 italic">No description provided</p>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded">
            <h2 class="text-lg font-semibold mb-3">Project Details</h2>

            <div class="mb-4">
              <h3 class="text-sm font-medium text-gray-500">Created</h3>
              <p>{{ formatDate(project.created_at) }}</p>
            </div>

            <div
              class="mb-4"
              v-if="
                project.updated_at && project.updated_at !== project.created_at
              "
            >
              <h3 class="text-sm font-medium text-gray-500">Last Updated</h3>
              <p>{{ formatDate(project.updated_at) }}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">Deadline</h3>
              <p
                v-if="project.deadline"
                :class="{
                  'text-red-600': isDeadlinePassed,
                  'text-orange-600': isDeadlineSoon,
                }"
              >
                {{ formatDate(project.deadline) }}
                <span v-if="isDeadlinePassed" class="block text-sm"
                  >(Overdue)</span
                >
                <span v-else-if="isDeadlineSoon" class="block text-sm"
                  >(Coming soon)</span
                >
              </p>
              <p v-else class="text-gray-500 italic">No deadline set</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Project Members</h2>
          <button
            v-if="canManageProject"
            @click="showAddMemberDialog = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
              />
            </svg>
            Add Member
          </button>
        </div>

        <MembersList
          :members="projectMembers"
          :loading="loadingMembers"
          :projectCreatorId="project.created_by"
          @remove="removeMember"
        />
      </div>

      <!-- Delete Confirmation Dialog -->
      <div
        v-if="showDeleteConfirmation"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-md">
          <h3 class="text-lg font-bold mb-3">Delete Project</h3>
          <p class="mb-4">
            Are you sure you want to delete "{{ project.title }}"? This action
            cannot be undone.
          </p>
          <div class="flex justify-end">
            <button
              @click="showDeleteConfirmation = false"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              @click="deleteProject"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              :disabled="deleting"
            >
              <span v-if="deleting" class="flex items-center">
                <span
                  class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"
                ></span>
                Deleting...
              </span>
              <span v-else>Delete Project</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Add Member Dialog -->
      <AddMemberDialog
        v-if="showAddMemberDialog"
        @close="showAddMemberDialog = false"
        @add="addMember"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AddMemberDialog from "@/components/projects/AddMemberDialog.vue";
import MembersList from "@/components/projects/MembersList.vue";
import { useAuthStore } from "@/stores/auth";
import { useProjectsStore } from "@/stores/projects";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const projectsStore = useProjectsStore();
const authStore = useAuthStore();

// State
const loading = ref(true);
const loadingMembers = ref(false);
const showDeleteConfirmation = ref(false);
const showAddMemberDialog = ref(false);
const deleting = ref(false);

const projectId = computed(() => parseInt(route.params.id as string));

onMounted(async () => {
  loading.value = true;
  try {
    await projectsStore.fetchProjectById(projectId.value);
    await fetchMembers();
  } catch (error) {
    console.error("Error fetching project:", error);
  } finally {
    loading.value = false;
  }
});

const project = computed(() => projectsStore.currentProject);
const projectMembers = computed(() => projectsStore.projectMembers);

const canManageProject = computed(() => {
  if (!project.value || !authStore.user) return false;

  if (authStore.user.role === "admin") return true;

  return project.value.created_by === authStore.user.id;
});

const isDeadlineSoon = computed(() => {
  if (!project.value?.deadline) return false;

  const deadlineDate = new Date(project.value.deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 && diffDays <= 7;
});

const isDeadlinePassed = computed(() => {
  if (!project.value?.deadline) return false;

  const deadlineDate = new Date(project.value.deadline);
  const today = new Date();

  return deadlineDate < today;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fetchMembers = async () => {
  if (!projectId.value) return;

  loadingMembers.value = true;
  try {
    await projectsStore.fetchProjectMembers(projectId.value);
  } catch (error) {
    console.error("Error fetching project members:", error);
  } finally {
    loadingMembers.value = false;
  }
};

const navigateToProjects = () => {
  router.push("/projects");
};

const navigateToEdit = () => {
  router.push(`/projects/${projectId.value}/edit`);
};

const confirmDeleteProject = () => {
  showDeleteConfirmation.value = true;
};

const deleteProject = async () => {
  if (!projectId.value) return;

  deleting.value = true;
  try {
    await projectsStore.deleteProject(projectId.value);
    router.push("/projects");
  } catch (error) {
    console.error("Error deleting project:", error);
  } finally {
    deleting.value = false;
    showDeleteConfirmation.value = false;
  }
};

const addMember = async (userId: number) => {
  if (!projectId.value) return;

  try {
    await projectsStore.addProjectMember(projectId.value, userId);
    showAddMemberDialog.value = false;
  } catch (error) {
    console.error("Error adding member to project:", error);
  }
};

const removeMember = async (userId: number) => {
  if (!projectId.value) return;

  try {
    await projectsStore.removeProjectMember(projectId.value, userId);
  } catch (error) {
    console.error("Error removing member from project:", error);
  }
};
</script>
