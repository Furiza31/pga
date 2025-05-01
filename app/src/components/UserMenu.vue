<template>
  <div class="relative" v-if="authStore.user">
    <div class="flex items-center">
      <button
        @click="isOpen = !isOpen"
        class="flex items-center justify-center w-fit p-1.5 rounded-sm bg-blue-600 text-white focus:outline-none"
      >
        <span class="font-medium">
          {{ authStore.user.name }}
        </span>
      </button>
    </div>

    <!-- Dropdown menu -->
    <div
      v-show="isOpen"
      @click.away="isOpen = false"
      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
    >
      <router-link
        to="/profile"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        @click="isOpen = false"
      >
        Your Profile
      </router-link>
      <!-- Admin links section -->
      <template v-if="authStore.isAdmin">
        <div class="border-t border-gray-100 my-1"></div>
        <p class="px-4 py-1 text-xs font-semibold text-gray-500">Admin</p>
        <router-link
          to="/admin/users"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="isOpen = false"
        >
          Manage Users
        </router-link>
        <router-link
          to="/admin/forum/categories"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="isOpen = false"
        >
          Manage Forum
        </router-link>
      </template>
      <div class="border-t border-gray-100 my-1"></div>
      <a
        href="#"
        @click.prevent="logout"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Sign out
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);

const logout = () => {
  isOpen.value = false;
  authStore.logout();
  router.push({ name: "login" });
};
</script>
