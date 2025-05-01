<template>
  <div>
    <div class="mb-6 flex items-center">
      <router-link
        :to="`/events/${eventId}`"
        class="text-blue-600 hover:text-blue-800 mr-2"
      >
        &larr; Back to Event Details
      </router-link>
    </div>

    <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Event</h1>
    <div
      v-if="eventStore.loading && !eventStore.currentEvent"
      class="text-center py-8"
    >
      <div class="text-gray-600">Loading event...</div>
    </div>

    <div v-else-if="!eventStore.currentEvent" class="text-center py-8">
      <div class="text-gray-600">Event not found</div>
      <div class="mt-4">
        <router-link to="/events" class="text-blue-600 hover:text-blue-800">
          Return to events list
        </router-link>
      </div>
    </div>

    <div v-else>
      <EventForm :eventId="eventId" :event="eventStore.currentEvent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EventForm from "@/components/events/EventForm.vue";
import { useEventStore } from "@/stores/events";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const eventStore = useEventStore();

const eventId = parseInt(route.params.id as string);

onMounted(async () => {
  await eventStore.fetchEventById(eventId);
});
</script>
