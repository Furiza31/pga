<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Events</h1>
    <EventsList
      :events="eventStore.events"
      :loading="eventStore.loading"
      :showActions="true"
    />
  </div>
</template>

<script setup lang="ts">
import EventsList from "@/components/events/EventsList.vue";
import { useEventStore } from "@/stores/events";
import { onMounted } from "vue";

const eventStore = useEventStore();

onMounted(async () => {
  if (eventStore.events.length === 0) {
    await eventStore.fetchAllEvents();
  }
});
</script>
