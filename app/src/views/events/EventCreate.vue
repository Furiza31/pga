<template>
  <div>
    <div class="mb-6 flex items-center">
      <router-link to="/events" class="text-blue-600 hover:text-blue-800 mr-2">
        &larr; Back to Events
      </router-link>
    </div>

    <h1 class="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>
    <EventForm />
  </div>
</template>

<script setup lang="ts">
import EventForm from "@/components/events/EventForm.vue";
</script>
