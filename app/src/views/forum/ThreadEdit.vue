<template>
  <div class="thread-edit container mx-auto px-4 py-8">
    <div class="mb-4">
      <div class="flex items-center space-x-2 mb-1">
        <router-link to="/forum" class="text-blue-500 hover:text-blue-700">
          Forums
        </router-link>
        <span class="text-gray-500">›</span>
        <router-link
          v-if="thread?.category_id"
          :to="`/forum/categories/${thread.category_id}`"
          class="text-blue-500 hover:text-blue-700"
        >
          {{ thread?.category_name }}
        </router-link>
        <span class="text-gray-500">›</span>
        <router-link
          :to="`/forum/threads/${threadId}`"
          class="text-blue-500 hover:text-blue-700"
        >
          Thread
        </router-link>
      </div>
      <h1 class="text-2xl font-bold">Edit Thread</h1>
    </div>

    <div v-if="loading" class="py-4 text-center">
      <p>Loading thread data...</p>
    </div>

    <div v-else-if="!thread" class="py-8 text-center">
      <p class="text-lg text-red-500">
        Thread not found or you don't have permission to edit it
      </p>
      <router-link
        to="/forum"
        class="text-blue-500 hover:text-blue-700 mt-2 inline-block"
      >
        Return to Forum Home
      </router-link>
    </div>

    <div
      v-else
      class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
    >
      <ThreadForm :threadId="threadId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ThreadForm from "@/components/forum/ThreadForm.vue";
import { useAuthStore } from "@/stores/auth";
import { useForumStore } from "@/stores/forum";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const forumStore = useForumStore();
const authStore = useAuthStore();

const loading = ref(true);
const threadId = computed(() => parseInt(route.params.id as string));
const thread = computed(() => forumStore.currentThread);

// Check if user can edit this thread (owner or admin)
const canEdit = computed(() => {
  const user = authStore.user;
  if (!user || !thread.value) return false;
  return user.id === thread.value.created_by || user.role === "admin";
});

onMounted(async () => {
  try {
    await forumStore.fetchThreadById(threadId.value);

    // Redirect if user doesn't have permission to edit
    if (!canEdit.value) {
      router.push(`/forum/threads/${threadId.value}`);
    }
  } catch (error) {
    console.error("Failed to load thread:", error);
  } finally {
    loading.value = false;
  }
});
</script>
