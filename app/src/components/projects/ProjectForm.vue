<template>
  <form @submit.prevent="handleSubmit" class="project-form">
    <div class="mb-4">
      <label for="title" class="block text-sm font-medium text-gray-700 mb-1"
        >Project Title *</label
      >
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        :class="{ 'border-red-500': validationErrors.title }"
        required
      />
      <p v-if="validationErrors.title" class="mt-1 text-sm text-red-600">
        {{ validationErrors.title }}
      </p>
    </div>

    <div class="mb-4">
      <label
        for="description"
        class="block text-sm font-medium text-gray-700 mb-1"
        >Description</label
      >
      <textarea
        id="description"
        v-model="formData.description"
        rows="4"
        class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
      ></textarea>
    </div>

    <div class="mb-6">
      <label for="deadline" class="block text-sm font-medium text-gray-700 mb-1"
        >Deadline (Optional)</label
      >
      <input
        id="deadline"
        v-model="formData.deadline"
        type="date"
        class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
      />
      <p class="mt-1 text-sm text-gray-500">
        Set a target completion date for this project
      </p>
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        @click="$emit('cancel')"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        :disabled="loading"
      >
        <span v-if="loading" class="flex items-center">
          <span
            class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"
          ></span>
          Saving...
        </span>
        <span v-else>{{ submitButtonText }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Project, ProjectCreateData, ProjectUpdateData } from "@/types/project";
import { computed, onMounted, reactive } from "vue";

const props = defineProps<{
  project?: Project;
  isEditing?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", data: ProjectCreateData | ProjectUpdateData): void;
  (e: "cancel"): void;
}>();

const submitButtonText = computed(() =>
  props.isEditing ? "Update Project" : "Create Project"
);

const formData = reactive<{
  title: string;
  description: string;
  deadline: string;
}>({
  title: "",
  description: "",
  deadline: "",
});

const validationErrors = reactive<{
  title?: string;
}>({});

// Initialize form with project data if in edit mode
onMounted(() => {
  if (props.project) {
    formData.title = props.project.title;
    formData.description = props.project.description || "";
    formData.deadline = props.project.deadline
      ? new Date(props.project.deadline).toISOString().split("T")[0]
      : "";
  }
});

// Form validation
const validateForm = (): boolean => {
  validationErrors.title = "";

  if (!formData.title.trim()) {
    validationErrors.title = "Project title is required";
    return false;
  }

  if (formData.title.trim().length < 3) {
    validationErrors.title = "Project title must be at least 3 characters";
    return false;
  }

  return true;
};

// Handle form submission
const handleSubmit = () => {
  if (!validateForm()) return;

  const submitData: ProjectCreateData | ProjectUpdateData = {
    title: formData.title.trim(),
  };

  if (formData.description.trim()) {
    submitData.description = formData.description.trim();
  } else {
    submitData.description = null;
  }

  if (formData.deadline) {
    submitData.deadline = formData.deadline;
  } else {
    submitData.deadline = null;
  }

  emit("submit", submitData);
};
</script>
