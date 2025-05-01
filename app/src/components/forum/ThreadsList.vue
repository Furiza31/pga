<template>
  <div class="threads-list">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-semibold">Threads</h3>
      <router-link
        v-if="categoryId && isLoggedIn"
        :to="`/forum/threads/create?categoryId=${categoryId}`"
        class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
      >
        New Thread
      </router-link>
    </div>

    <div v-if="loading" class="py-4 text-center">
      <p>Loading threads...</p>
    </div>
    <div
      v-else-if="threads.length === 0"
      class="py-6 text-center border border-gray-200 rounded-md"
    >
      <p class="text-gray-600">No threads in this category yet</p>
      <router-link
        v-if="isLoggedIn"
        :to="`/forum/threads/create?categoryId=${categoryId}`"
        class="inline-block mt-2 text-blue-500 hover:text-blue-700"
      >
        Start a new discussion
      </router-link>
    </div>
    <div v-else class="space-y-3">
      <ThreadItem v-for="thread in threads" :key="thread.id" :thread="thread" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useForumStore } from "@/stores/forum";
import type { Thread } from "@/types/forum";
import { computed, onMounted, ref } from "vue";
import ThreadItem from "./ThreadItem.vue";

const props = defineProps<{
  categoryId: number;
}>();

const forumStore = useForumStore();
const authStore = useAuthStore();
const loading = ref(true);
const threads = ref<Thread[]>([]);
const isLoggedIn = computed(() => !!authStore.user);

onMounted(async () => {
  try {
    threads.value = await forumStore.fetchThreadsByCategory(props.categoryId);
  } finally {
    loading.value = false;
  }
});
</script>
