<template>
  <div class="add-member-dialog">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-lg w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">Add Member to Project</h3>
          <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <label
            for="search"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Find User</label
          >
          <div class="relative">
            <input
              id="search"
              v-model="searchQuery"
              @input="searchUsers"
              type="text"
              placeholder="Search by name or email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
            <div v-if="loading" class="absolute right-2 top-2">
              <div
                class="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-transparent"
              ></div>
            </div>
          </div>

          <div v-if="searchError" class="mt-1 text-sm text-red-600">
            {{ searchError }}
          </div>
        </div>

        <div
          v-if="searchResults.length > 0"
          class="mb-6 max-h-60 overflow-y-auto border rounded"
        >
          <ul class="divide-y divide-gray-200">
            <li
              v-for="user in searchResults"
              :key="user.id"
              @click="selectUser(user)"
              class="p-3 hover:bg-gray-50 cursor-pointer"
            >
              <div class="flex items-center">
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ user.name }}
                  </p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div
          v-else-if="searchQuery && !loading"
          class="mb-6 p-3 bg-gray-50 rounded text-center text-gray-600"
        >
          No users found matching "{{ searchQuery }}"
        </div>

        <div v-if="selectedUser" class="mb-6 p-4 border rounded bg-blue-50">
          <p class="font-medium">Selected User:</p>
          <div class="flex items-center justify-between mt-2">
            <div>
              <p class="text-gray-900">{{ selectedUser.name }}</p>
              <p class="text-sm text-gray-600">{{ selectedUser.email }}</p>
            </div>
            <button
              @click="selectedUser = null"
              class="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            @click="$emit('close')"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            @click="addMember"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            :disabled="!selectedUser || adding"
          >
            <span v-if="adding" class="flex items-center">
              <span
                class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"
              ></span>
              Adding...
            </span>
            <span v-else>Add Member</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from "@/stores/projects";
import { ref } from "vue";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "add", userId: number): void;
}>();

interface User {
  id: number;
  name: string;
  email: string;
}

const searchQuery = ref("");
const searchResults = ref<User[]>([]);
const selectedUser = ref<User | null>(null);
const loading = ref(false);
const adding = ref(false);
const searchError = ref("");
const projectStore = useProjectsStore();

// Search for users
const searchUsers = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  loading.value = true;
  searchError.value = "";

  try {
    const result = await projectStore.searchUsers(searchQuery.value);

    searchResults.value = result;
  } catch (error) {
    console.error("Error searching for users:", error);
    searchError.value = "Failed to search for users. Please try again.";
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

// Select a user
const selectUser = (user: User) => {
  selectedUser.value = user;
  searchResults.value = [];
  searchQuery.value = "";
};

// Add selected user as a member
const addMember = async () => {
  if (!selectedUser.value) return;

  adding.value = true;
  try {
    await emit("add", selectedUser.value.id);
  } finally {
    adding.value = false;
  }
};
</script>
