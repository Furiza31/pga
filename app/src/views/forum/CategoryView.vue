<template>
  <div class="category-view container mx-auto px-4 py-8">
    <div v-if="loading" class="py-4 text-center">
      <p>Loading category...</p>
    </div>

    <template v-else-if="category">
      <div class="mb-6">
        <div class="flex items-center space-x-2 mb-1">
          <router-link to="/forum" class="text-blue-500 hover:text-blue-700">
            Forums
          </router-link>
          <span class="text-gray-500">›</span>
          <h1 class="text-2xl font-bold">{{ category.name }}</h1>
        </div>
        <p v-if="category.description" class="text-gray-600">
          {{ category.description }}
        </p>
      </div>

      <ThreadsList :categoryId="categoryId" />
    </template>

    <div v-else class="py-8 text-center">
      <p class="text-lg text-red-500">Category not found</p>
      <router-link
        to="/forum"
        class="text-blue-500 hover:text-blue-700 mt-2 inline-block"
      >
        Return to Forum Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThreadsList from "@/components/forum/ThreadsList.vue";
import { useForumStore } from "@/stores/forum";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const forumStore = useForumStore();
const loading = ref(true);
const categoryId = computed(() => parseInt(route.params.id as string));

// Use computed to access the current category from the store
const category = computed(() => forumStore.currentCategory);

// Load category data when the component is mounted or the categoryId changes
async function loadCategory() {
  if (!categoryId.value) return;

  loading.value = true;
  try {
    await forumStore.fetchCategoryById(categoryId.value);
  } catch (error) {
    console.error("Failed to load category:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(loadCategory);

// Watch for route changes to reload data if necessary
watch(() => route.params.id, loadCategory);
</script>
