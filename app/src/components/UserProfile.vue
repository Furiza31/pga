<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6 flex justify-between">
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          User Profile
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Personal details and account information
        </p>
      </div>
      <button
        @click="isEditing = !isEditing"
        class="px-4 py-2 h-fit text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        {{ isEditing ? "Cancel" : "Edit Profile" }}
      </button>
    </div>

    <div class="border-t border-gray-200">
      <dl>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">Full name</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <template v-if="!isEditing">{{ user.name }}</template>
            <input
              v-else
              v-model="editForm.name"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </dd>
        </div>

        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Email address</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <template v-if="!isEditing">{{ user.email }}</template>
            <input
              v-else
              v-model="editForm.email"
              type="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </dd>
        </div>

        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">Role</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize"
          >
            {{ user.role }}
          </dd>
        </div>

        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Member since</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{
              user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"
            }}
          </dd>
        </div>
      </dl>
    </div>

    <div v-if="isEditing" class="px-4 py-3 bg-gray-50 text-right sm:px-6">
      <div v-if="error" class="mb-4 text-sm text-red-600">{{ error }}</div>
      <button
        @click="saveProfile"
        :disabled="loading"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span v-if="loading">Saving...</span>
        <span v-else>Save</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import type { User } from "@/types/auth";
import { onMounted, reactive, ref } from "vue";

const props = defineProps<{
  user: User;
}>();

const authStore = useAuthStore();
const isEditing = ref(false);
const loading = ref(false);
const error = ref("");

const editForm = reactive({
  name: props.user.name,
  email: props.user.email,
});

// Reset form when editing is toggled
onMounted(() => {
  if (props.user) {
    editForm.name = props.user.name;
    editForm.email = props.user.email;
  }
});

const saveProfile = async () => {
  loading.value = true;
  error.value = "";

  try {
    authStore.setUser({
      ...props.user,
      name: editForm.name,
      email: editForm.email,
    });

    authStore.updateUser(editForm);

    isEditing.value = false;
  } catch (err: any) {
    error.value = err.message || "Failed to update profile";
  } finally {
    loading.value = false;
  }
};
</script>
