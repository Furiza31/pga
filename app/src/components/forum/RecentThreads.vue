<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Recent Discussions
      </h3>
    </div>

    <div v-if="loading" class="p-6 text-center">
      <div class="text-gray-600">Loading discussions...</div>
    </div>

    <div v-else-if="threads.length === 0" class="p-6 text-center">
      <div class="text-gray-600">No discussions available</div>
    </div>

    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="thread in threads"
        :key="thread.id"
        class="px-4 py-4 sm:px-6 hover:bg-gray-50"
      >
        <div class="flex items-center justify-between">
          <router-link
            :to="`/forum/threads/${thread.id}`"
            class="block flex-grow"
          >
            <p class="text-sm font-medium text-blue-600 truncate">
              {{ thread.title }}
            </p>
            <div class="mt-1 flex items-center text-xs text-gray-500">
              <p v-if="thread.category_name">{{ thread.category_name }}</p>
              <p v-if="thread.creator_name" class="ml-1">
                <span class="mx-1">•</span>By: {{ thread.creator_name }}
              </p>
              <p v-if="thread.reply_count" class="ml-1">
                <span class="mx-1">•</span>{{ thread.reply_count }}
                {{ thread.reply_count === 1 ? "reply" : "replies" }}
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
      <router-link
        to="/forum"
        class="text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        View all discussions <span aria-hidden="true">&rarr;</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForumStore } from "@/stores/forum";
import type { Thread } from "@/types/forum";
import { onMounted, ref } from "vue";

const props = defineProps({
  limit: {
    type: Number,
    default: 5,
  },
});

const forumStore = useForumStore();
const threads = ref<Thread[]>([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    // First fetch all categories
    await forumStore.fetchAllCategories();

    // For each category, fetch the threads and combine them
    const allThreads: Thread[] = [];

    for (const category of forumStore.categories) {
      try {
        const categoryThreads = await forumStore.fetchThreadsByCategory(
          category.id
        );
        allThreads.push(...categoryThreads);
      } catch (error) {
        console.error(
          `Failed to fetch threads for category ${category.id}:`,
          error
        );
      }
    }

    // Sort by most recent and limit the number
    threads.value = allThreads
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, props.limit);
  } catch (error) {
    console.error("Failed to fetch forum threads:", error);
  } finally {
    loading.value = false;
  }
});
</script>
