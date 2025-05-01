<template>
  <div class="thread-view container mx-auto px-4 py-8">
    <div v-if="loading" class="py-4 text-center">
      <p>Loading thread...</p>
    </div>

    <template v-else-if="thread">
      <div class="mb-4">
        <div class="flex items-center space-x-2 mb-1">
          <router-link to="/forum" class="text-blue-500 hover:text-blue-700">
            Forums
          </router-link>
          <span class="text-gray-500">›</span>
          <router-link
            :to="`/forum/categories/${thread.category_id}`"
            class="text-blue-500 hover:text-blue-700"
          >
            {{ thread.category_name }}
          </router-link>
          <span class="text-gray-500">›</span>
        </div>

        <h1 class="text-2xl font-bold">{{ thread.title }}</h1>
      </div>

      <!-- Thread content -->
      <div
        class="bg-white border border-gray-200 rounded-md p-4 mb-6 shadow-sm"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center space-x-2">
            <span class="font-medium">{{
              thread.creator_name || "Unknown"
            }}</span>
            <span class="text-xs text-gray-500">{{
              formatDate(thread.created_at)
            }}</span>
            <span
              v-if="
                thread.updated_at && thread.updated_at !== thread.created_at
              "
              class="text-xs text-gray-500"
              >(edited)</span
            >
          </div>

          <div v-if="canEditThread" class="flex space-x-2">
            <router-link
              :to="`/forum/threads/${thread.id}/edit`"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </router-link>
            <button
              @click="showDeleteDialog = true"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="thread-content mb-2">
          <p>{{ thread.content }}</p>
        </div>
      </div>

      <!-- Replies section -->
      <div class="replies mb-6">
        <h2 class="text-xl font-semibold mb-4">
          {{ thread.replies?.length || 0 }}
          {{ thread.replies?.length === 1 ? "Reply" : "Replies" }}
        </h2>

        <div
          v-if="!thread.replies?.length"
          class="py-4 text-center border border-gray-200 rounded-md"
        >
          <p class="text-gray-600">No replies yet. Be the first to reply!</p>
        </div>

        <div v-else class="space-y-4">
          <ReplyItem
            v-for="reply in thread.replies"
            :key="reply.id"
            :reply="reply"
            :threadId="thread.id"
            @deleted="refreshThread"
          />
        </div>
      </div>

      <!-- Reply form -->
      <div v-if="isLoggedIn">
        <ReplyForm :threadId="threadId" @reply-added="refreshThread" />
      </div>
      <div v-else class="text-center py-4 border border-gray-200 rounded-md">
        <p class="text-gray-600">
          You must be logged in to reply to this thread.
        </p>
        <router-link
          to="/login"
          class="text-blue-500 hover:text-blue-700 mt-2 inline-block"
        >
          Log in to reply
        </router-link>
      </div>
    </template>

    <div v-else class="py-8 text-center">
      <p class="text-lg text-red-500">Thread not found</p>
      <router-link
        to="/forum"
        class="text-blue-500 hover:text-blue-700 mt-2 inline-block"
      >
        Return to Forum Home
      </router-link>
    </div>

    <!-- Delete Thread Confirmation Dialog -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      title="Delete Thread"
      message="Are you sure you want to delete this thread? This action cannot be undone and all replies will be deleted."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="deleteThread"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import ReplyForm from "@/components/forum/ReplyForm.vue";
import ReplyItem from "@/components/forum/ReplyItem.vue";
import { useAuthStore } from "@/stores/auth";
import { useForumStore } from "@/stores/forum";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const forumStore = useForumStore();
const authStore = useAuthStore();
const loading = ref(true);
const threadId = computed(() => parseInt(route.params.id as string));
const showDeleteDialog = ref(false);

// Get current thread from the store
const thread = computed(() => forumStore.currentThread);

// Check if user is logged in
const isLoggedIn = computed(() => !!authStore.user);

// Check if current user can edit/delete the thread
const canEditThread = computed(() => {
  const user = authStore.user;
  if (!user || !thread.value) return false;
  return user.id === thread.value.created_by || user.role === "admin";
});

// Format date function
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// Load thread data
async function loadThread() {
  if (!threadId.value) return;

  loading.value = true;
  try {
    await forumStore.fetchThreadById(threadId.value);
  } catch (error) {
    console.error("Failed to load thread:", error);
  } finally {
    loading.value = false;
  }
}

// Refresh thread after reply added or deleted
async function refreshThread() {
  if (!threadId.value) return;
  await forumStore.fetchThreadById(threadId.value);
}

// Delete the thread after confirmation
async function deleteThread() {
  if (!thread.value) return;

  try {
    await forumStore.deleteThread(thread.value.id);
    router.push(`/forum/categories/${thread.value.category_id}`);
  } catch (error) {
    console.error("Failed to delete thread:", error);
    alert("Failed to delete thread. Please try again.");
  } finally {
    showDeleteDialog.value = false;
  }
}

onMounted(loadThread);

// Watch for route changes to reload data if necessary
watch(() => route.params.id, loadThread);
</script>
