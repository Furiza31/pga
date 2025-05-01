<template>
  <div
    class="thread-item border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition"
  >
    <router-link :to="`/forum/threads/${thread.id}`" class="block">
      <div class="flex justify-between">
        <div>
          <h4 class="text-lg font-medium text-blue-600">{{ thread.title }}</h4>
          <div class="flex items-center mt-1 text-sm text-gray-500">
            <span>By: {{ thread.creator_name || "Unknown" }}</span>
            <span class="mx-2">•</span>
            <span>{{ formatDate(thread.created_at) }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end text-right">
          <span class="text-sm text-gray-600">
            {{ thread.reply_count || 0 }}
            {{ thread.reply_count === 1 ? "reply" : "replies" }}
          </span>
          <span v-if="thread.last_reply_at" class="text-xs text-gray-500">
            Last reply: {{ formatDate(thread.last_reply_at) }}
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { Thread } from "@/types/forum";

defineProps<{
  thread: Thread;
}>();

function formatDate(dateString?: string) {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString();
}
</script>
