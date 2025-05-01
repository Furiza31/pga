<template>
  <div
    class="category-item p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition bg-gray-50"
  >
    <router-link :to="`/forum/categories/${category.id}`" class="block">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-medium text-blue-600">{{ category.name }}</h3>
          <p v-if="category.description" class="text-gray-600 mt-1">
            {{ category.description }}
          </p>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-sm text-gray-500">
            {{ category.thread_count || 0 }}
            {{ category.thread_count === 1 ? "thread" : "threads" }}
          </span>
          <span class="text-xs text-gray-400"
            >Created: {{ formatDate(category.created_at) }}</span
          >
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { Category } from "@/types/forum";

defineProps<{
  category: Category;
}>();

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}
</script>
