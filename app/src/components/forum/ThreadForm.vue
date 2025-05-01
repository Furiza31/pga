<template>
  <div class="thread-form">
    <h2 class="text-xl font-semibold mb-4">
      {{ isEditing ? "Edit Thread" : "Create New Thread" }}
    </h2>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div v-if="!categoryId && !isEditing" class="form-group">
        <label
          for="category"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Category</label
        >
        <select
          id="category"
          v-model="form.category_id"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>Select a category</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1"
          >Title</label
        >
        <input
          id="title"
          type="text"
          v-model="form.title"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          required
          minlength="5"
          maxlength="100"
          placeholder="Thread title"
        />
      </div>

      <div class="form-group">
        <label
          for="content"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Content</label
        >
        <textarea
          id="content"
          v-model="form.content"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          rows="6"
          minlength="10"
          placeholder="Write your post here..."
        ></textarea>
      </div>

      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

      <div class="flex space-x-4">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          :disabled="loading"
        >
          {{ isEditing ? "Update Thread" : "Create Thread" }}
        </button>
        <button
          type="button"
          @click="cancel"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForumStore } from "@/stores/forum";
import type { Category, ThreadCreateData } from "@/types/forum";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  threadId?: number;
  categoryId?: number;
}>();

const forumStore = useForumStore();
const router = useRouter();
const loading = ref(false);
const error = ref("");
const categories = ref<Category[]>([]);
const form = ref<ThreadCreateData>({
  title: "",
  content: "",
  category_id: props.categoryId || 0,
});

const isEditing = computed(() => !!props.threadId);

onMounted(async () => {
  try {
    // Load categories if needed
    if (!props.categoryId || !props.threadId) {
      categories.value = await forumStore.fetchAllCategories();
    }

    // If editing, load thread data
    if (props.threadId) {
      loading.value = true;
      const thread = await forumStore.fetchThreadById(props.threadId);
      form.value = {
        title: thread.title,
        content: thread.content,
        category_id: thread.category_id,
      };
      loading.value = false;
    } else if (props.categoryId) {
      form.value.category_id = props.categoryId;
    }
  } catch (err) {
    error.value = "Failed to load data";
    console.error(err);
  }
});

async function submitForm() {
  if (!form.value.title || !form.value.content || !form.value.category_id) {
    error.value = "Please fill out all fields";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    if (isEditing.value && props.threadId) {
      await forumStore.updateThread(props.threadId, form.value);
      router.push(`/forum/threads/${props.threadId}`);
    } else {
      const thread = await forumStore.createThread(form.value);
      router.push(`/forum/threads/${thread.id}`);
    }
  } catch (err: any) {
    error.value = err.message || "Failed to save thread";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function cancel() {
  if (isEditing.value && props.threadId) {
    router.push(`/forum/threads/${props.threadId}`);
  } else if (props.categoryId) {
    router.push(`/forum/categories/${props.categoryId}`);
  } else {
    router.push("/forum");
  }
}
</script>
