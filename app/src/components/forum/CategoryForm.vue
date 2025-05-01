<template>
  <div class="category-form">
    <h3 class="text-xl font-medium mb-4">
      {{ isEditing ? "Edit Category" : "Create New Category" }}
    </h3>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div class="form-group">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1"
          >Category Name</label
        >
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Enter category name"
        />
      </div>

      <div class="form-group">
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Description</label
        >
        <textarea
          id="description"
          v-model="form.description"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Enter category description (optional)"
        ></textarea>
      </div>

      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

      <div class="flex space-x-4">
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {{ isEditing ? "Update Category" : "Create Category" }}
        </button>
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForumStore } from "@/stores/forum";
import { computed, ref, watch } from "vue";

const props = defineProps<{
  categoryId?: number;
}>();

const emit = defineEmits(["submit-success", "cancel"]);

const forumStore = useForumStore();
const loading = ref(false);
const error = ref("");

const form = ref({
  name: "",
  description: "",
});

const isEditing = computed(() => !!props.categoryId);

// Load category data if editing
watch(() => props.categoryId, loadCategory, { immediate: true });

async function loadCategory() {
  if (!props.categoryId) {
    form.value = { name: "", description: "" };
    return;
  }

  loading.value = true;
  try {
    const category = await forumStore.fetchCategoryById(props.categoryId);
    if (category) {
      form.value.name = category.name;
      form.value.description = category.description || "";
    }
  } catch (err) {
    console.error("Error loading category:", err);
    error.value = "Failed to load category data";
  } finally {
    loading.value = false;
  }
}

async function submitForm() {
  if (!form.value.name.trim()) {
    error.value = "Category name is required";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    if (isEditing.value && props.categoryId) {
      await forumStore.updateCategory(props.categoryId, {
        name: form.value.name,
        description: form.value.description || undefined,
      });
    } else {
      await forumStore.createCategory({
        name: form.value.name,
        description: form.value.description || undefined,
      });
    }
    emit("submit-success");
  } catch (err: any) {
    error.value = err.message || "Failed to save category";
    console.error("Error saving category:", err);
  } finally {
    loading.value = false;
  }
}
</script>
