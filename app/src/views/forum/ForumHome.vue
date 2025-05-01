<template>
  <div class="forum-home container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Community Forum</h1>
      <p class="text-gray-600 mt-2">
        Welcome to our community forum. Browse categories below or start a new
        discussion.
      </p>
    </div>

    <CategoryList />
  </div>
</template>

<script setup lang="ts">
import CategoryList from "@/components/forum/CategoryList.vue";
</script>
