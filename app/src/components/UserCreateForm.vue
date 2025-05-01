<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white shadow-md rounded-lg p-6"
  >
    <div class="grid grid-cols-1 gap-6">
      <!-- Name Field -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Name</label
        >
        <input
          v-model="form.name"
          type="text"
          id="name"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.name }"
          required
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">
          {{ errors.name }}
        </p>
      </div>

      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <input
          v-model="form.email"
          type="email"
          id="email"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.email }"
          required
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Password</label
        >
        <input
          v-model="form.password"
          type="password"
          id="password"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.password }"
          required
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">
          {{ errors.password }}
        </p>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="button"
          @click="$router.back()"
          class="mr-3 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          :disabled="loading"
        >
          {{ loading ? "Creating..." : "Create User" }}
        </button>
      </div>

      <!-- Form Error -->
      <div v-if="formError" class="text-red-600 text-center">
        {{ formError }}
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useUsersStore } from "@/stores/users";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const usersStore = useUsersStore();

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const errors = reactive({
  name: "",
  email: "",
  password: "",
});

const loading = ref(false);
const formError = ref("");

const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.name = "";
  errors.email = "";
  errors.password = "";
  formError.value = "";

  // Validate name
  if (!form.name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  }

  // Validate email
  if (!form.email) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  // Validate password
  if (!form.password) {
    errors.password = "Password is required";
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  formError.value = "";

  try {
    await usersStore.createUser(form);
    router.push("/admin/users");
  } catch (error: any) {
    formError.value =
      error.message || "Failed to create user. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
