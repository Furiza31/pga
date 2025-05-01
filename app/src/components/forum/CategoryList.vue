<template>
  <div class="category-list">
    <h2 class="text-2xl font-semibold mb-4">Forum Categories</h2>
    <div v-if="loading" class="py-4 text-center">
      <p>Loading categories...</p>
    </div>
    <div v-else-if="categories.length === 0" class="py-6 text-center">
      <p class="text-gray-600">No categories found</p>
    </div>
    <div v-else class="space-y-4">
      <CategoryItem
        v-for="category in categories"
        :key="category.id"
        :category="category"
      />
    </div>
    <div v-if="isAdmin" class="mt-6">
      <button
        @click="$router.push('/admin/forum/categories')"
        class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
      >
        Manage Categories
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useForumStore } from "@/stores/forum";
import type { Category } from "@/types/forum";
import { computed, onMounted, ref } from "vue";
import CategoryItem from "./CategoryItem.vue";

const forumStore = useForumStore();
const authStore = useAuthStore();
const loading = ref(true);
const categories = ref<Category[]>([]);
const isAdmin = computed(() => authStore.user?.role === "admin");

onMounted(async () => {
  try {
    categories.value = await forumStore.fetchAllCategories();
  } finally {
    loading.value = false;
  }
});
</script>
