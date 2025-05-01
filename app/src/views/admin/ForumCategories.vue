<template>
  <div class="admin-categories container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Manage Forum Categories</h1>
      <button
        v-if="!showForm"
        @click="createCategory"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
      >
        Create New Category
      </button>
    </div>

    <!-- Category Form -->
    <div
      v-if="showForm"
      class="bg-white p-6 border border-gray-200 rounded-lg shadow-sm mb-8"
    >
      <CategoryForm
        :categoryId="selectedCategoryId"
        @submit-success="handleFormSuccess"
        @cancel="cancelForm"
      />
    </div>

    <!-- Categories List -->
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-medium">Forum Categories</h2>
      </div>

      <div v-if="loading" class="p-6 text-center">
        <p>Loading categories...</p>
      </div>

      <div v-else-if="categories.length === 0" class="p-6 text-center">
        <p class="text-gray-500">
          No categories found. Create your first category.
        </p>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Threads
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in categories" :key="category.id">
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ category.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ category.description || "-" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ category.thread_count || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(category.created_at) }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <button
                @click="editCategory(category.id)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Edit
              </button>
              <button
                @click="showDeleteDialog(category.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      v-if="deleteDialogVisible"
      title="Delete Category"
      message="Are you sure you want to delete this category? This will also delete all threads within it."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDeleteCategory"
      @cancel="cancelDeleteDialog"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import CategoryForm from "@/components/forum/CategoryForm.vue";
import { useForumStore } from "@/stores/forum";
import type { Category } from "@/types/forum";
import { onMounted, ref } from "vue";

const forumStore = useForumStore();
const loading = ref(true);
const categories = ref<Category[]>([]);
const showForm = ref(false);
const selectedCategoryId = ref<number | undefined>(undefined);
const deleteDialogVisible = ref(false);
const categoryToDelete = ref<number | null>(null);

// Fetch all categories on component mount
onMounted(async () => {
  await loadCategories();
});

async function loadCategories() {
  loading.value = true;
  try {
    categories.value = await forumStore.fetchAllCategories();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function createCategory() {
  selectedCategoryId.value = undefined;
  showForm.value = true;
}

function editCategory(id: number) {
  selectedCategoryId.value = id;
  showForm.value = true;
}

function cancelForm() {
  showForm.value = false;
}

async function handleFormSuccess() {
  showForm.value = false;
  await loadCategories();
}

// Show delete confirmation dialog
function showDeleteDialog(id: number) {
  categoryToDelete.value = id;
  deleteDialogVisible.value = true;
}

// Cancel delete
function cancelDeleteDialog() {
  deleteDialogVisible.value = false;
  categoryToDelete.value = null;
}

// Confirm and execute delete
async function confirmDeleteCategory() {
  if (categoryToDelete.value === null) return;

  try {
    await forumStore.deleteCategory(categoryToDelete.value);
    await loadCategories();
  } catch (error) {
    console.error(error);
  } finally {
    deleteDialogVisible.value = false;
    categoryToDelete.value = null;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}
</script>
