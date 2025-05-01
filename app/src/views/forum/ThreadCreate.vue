<template>
  <div class="thread-create container mx-auto px-4 py-8">
    <div class="mb-4">
      <div class="flex items-center space-x-2 mb-1">
        <router-link to="/forum" class="text-blue-500 hover:text-blue-700">
          Forums
        </router-link>
        <span v-if="categoryId" class="text-gray-500">›</span>
        <router-link
          v-if="categoryId"
          :to="`/forum/categories/${categoryId}`"
          class="text-blue-500 hover:text-blue-700"
        >
          {{ categoryName }}
        </router-link>
      </div>
      <h1 class="text-2xl font-bold">Start a New Discussion</h1>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <ThreadForm :categoryId="categoryId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ThreadForm from "@/components/forum/ThreadForm.vue";
import { useForumStore } from "@/stores/forum";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const forumStore = useForumStore();

// Get category ID from query parameter if available
const categoryId = computed(() => {
  const id = route.query.categoryId;
  return id ? parseInt(id as string) : undefined;
});

// Get category name if category ID is available
const categoryName = ref("");

onMounted(async () => {
  if (categoryId.value) {
    try {
      const category = await forumStore.fetchCategoryById(categoryId.value);
      if (category) {
        categoryName.value = category.name;
      }
    } catch (error) {
      console.error("Failed to load category:", error);
    }
  }
});
</script>
