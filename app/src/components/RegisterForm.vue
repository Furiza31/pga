<template>
  <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
    <div class="rounded-md shadow-sm -space-y-px">
      <div>
        <label for="name" class="sr-only">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          autocomplete="name"
          required
          v-model="form.name"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Full name"
        />
      </div>
      <div>
        <label for="email-address" class="sr-only">Email address</label>
        <input
          id="email-address"
          name="email"
          type="email"
          autocomplete="email"
          required
          v-model="form.email"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Email address"
        />
      </div>
      <div>
        <label for="password" class="sr-only">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="new-password"
          required
          v-model="form.password"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Password"
        />
      </div>
    </div>

    <div v-if="error" class="text-red-600 text-sm mt-2">
      {{ error }}
    </div>

    <div class="flex items-center justify-between">
      <div class="text-sm">
        <router-link
          to="/auth/login"
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          Already have an account? Sign in
        </router-link>
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="loading"
        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span v-if="loading">Loading...</span>
        <span v-else>Register</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import type { RegisterData } from "@/types/auth";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const error = ref("");

const form = reactive<RegisterData>({
  name: "",
  email: "",
  password: "",
});

const handleSubmit = async () => {
  error.value = "";
  loading.value = true;

  try {
    await authStore.register(form);
    // Show success message or directly login the user
    router.push({ name: "login" });
  } catch (err: any) {
    error.value = err.message || "Failed to register. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
