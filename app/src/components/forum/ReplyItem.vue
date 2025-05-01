<template>
  <div class="reply-item border border-gray-200 rounded-md p-4 mb-3">
    <div class="flex justify-between mb-2">
      <div class="flex items-center space-x-2">
        <span class="font-medium">{{ reply.creator_name || "Unknown" }}</span>
        <span class="text-xs text-gray-500">{{
          formatDate(reply.created_at)
        }}</span>
        <span
          v-if="reply.updated_at && reply.updated_at !== reply.created_at"
          class="text-xs text-gray-500"
          >(edited)</span
        >
      </div>
      <div v-if="canEdit" class="flex space-x-2">
        <button
          @click="editReply"
          class="text-sm text-blue-600 hover:text-blue-800"
        >
          Edit
        </button>
        <button
          @click="showDeleteDialog = true"
          class="text-sm text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>

    <div v-if="isEditing" class="mt-2">
      <textarea
        v-model="editContent"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      ></textarea>
      <div class="flex space-x-2 mt-2">
        <button
          @click="saveEdit"
          class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          :disabled="loading"
        >
          Save
        </button>
        <button
          @click="cancelEdit"
          class="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
    <div v-else class="reply-content">
      <p>{{ reply.content }}</p>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      title="Delete Reply"
      message="Are you sure you want to delete this reply? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="deleteReply"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useAuthStore } from "@/stores/auth";
import { useForumStore } from "@/stores/forum";
import type { Reply } from "@/types/forum";
import { computed, ref } from "vue";

const props = defineProps<{
  reply: Reply;
  threadId: number;
}>();

const emit = defineEmits(["deleted"]);

const authStore = useAuthStore();
const forumStore = useForumStore();
const loading = ref(false);
const isEditing = ref(false);
const editContent = ref("");
const showDeleteDialog = ref(false);

const canEdit = computed(() => {
  const user = authStore.user;
  return user && (user.id === props.reply.created_by || user.role === "admin");
});

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

function editReply() {
  editContent.value = props.reply.content;
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
}

async function saveEdit() {
  if (!editContent.value.trim()) {
    return;
  }

  loading.value = true;
  try {
    await forumStore.updateReply(props.reply.id, editContent.value);
    isEditing.value = false;
  } finally {
    loading.value = false;
  }
}

async function deleteReply() {
  loading.value = true;
  try {
    await forumStore.deleteReply(props.reply.id);
    emit("deleted", props.reply.id);
  } finally {
    loading.value = false;
    showDeleteDialog.value = false;
  }
}
</script>
