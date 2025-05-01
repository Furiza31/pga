<template>
  <div class="reply-form mt-6 p-4 border border-gray-200 rounded-md">
    <h3 class="text-lg font-medium mb-2">Post a Reply</h3>
    <form @submit.prevent="submitReply">
      <textarea
        v-model="content"
        placeholder="Write your reply here..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
        required
        minlength="3"
      ></textarea>
      <div v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</div>
      <button
        type="submit"
        :disabled="loading || !content.trim()"
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {{ loading ? "Posting..." : "Post Reply" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForumStore } from "@/stores/forum";
import { ref } from "vue";

const props = defineProps<{
  threadId: number;
}>();

const emit = defineEmits(["reply-added"]);

const forumStore = useForumStore();
const content = ref("");
const loading = ref(false);
const error = ref("");

async function submitReply() {
  if (!content.value.trim()) {
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await forumStore.createReply({
      thread_id: props.threadId,
      content: content.value.trim(),
    });

    content.value = "";
    emit("reply-added");
  } catch (err: any) {
    error.value = err.message || "Failed to post reply. Please try again.";
    console.error("Error posting reply:", err);
  } finally {
    loading.value = false;
  }
}
</script>
