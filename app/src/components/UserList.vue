<template>
  <div>
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-semibold">Users</h2>
      <router-link
        to="/admin/users/create"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add User
      </router-link>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div v-if="usersStore.loading" class="p-4 text-center">
        Loading users...
      </div>

      <div v-else-if="usersStore.users.length === 0" class="p-4 text-center">
        No users found
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in usersStore.users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ user.name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                "
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">
                {{
                  user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"
                }}
              </div>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"
            >
              <router-link
                :to="`/admin/users/${user.id}`"
                class="text-blue-600 hover:text-blue-900"
                v-if="authStore.user?.id !== user.id"
              >
                Edit
              </router-link>
              <button
                @click="openDeleteModal(user)"
                class="text-red-600 hover:text-red-900"
                v-if="authStore.user?.id !== user.id"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Delete User</h3>
        <p class="mb-6">
          Are you sure you want to delete {{ userToDelete?.name }}? This action
          cannot be undone.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            :disabled="deleteLoading"
          >
            {{ deleteLoading ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useUsersStore } from "@/stores/users";
import type { User } from "@/types/auth";
import { onMounted, ref } from "vue";

const usersStore = useUsersStore();
const authStore = useAuthStore();

const showDeleteModal = ref(false);
const userToDelete = ref<User | null>(null);
const deleteLoading = ref(false);

onMounted(async () => {
  if (usersStore.users.length === 0) {
    await usersStore.fetchUsers();
  }
});

const openDeleteModal = (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;

  deleteLoading.value = true;
  try {
    await usersStore.deleteUser(userToDelete.value.id);
    showDeleteModal.value = false;
    userToDelete.value = null;
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    deleteLoading.value = false;
  }
};
</script>
