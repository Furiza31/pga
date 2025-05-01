<template>
  <div>
    <div class="mb-6 flex items-center">
      <router-link to="/events" class="text-blue-600 hover:text-blue-800 mr-2">
        &larr; Back to Events
      </router-link>
    </div>

    <div v-if="eventStore.loading" class="text-center py-8">
      <div class="text-gray-600">Loading event details...</div>
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
      <EventDetail :event="eventStore.currentEvent" @delete="confirmDelete" />
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Event</h3>
        <p class="mb-6">
          Are you sure you want to delete "{{
            eventStore.currentEvent?.title
          }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
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
import EventDetail from "@/components/events/EventDetail.vue";
import { useEventStore } from "@/stores/events";
import type { Event } from "@/types/event";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const eventStore = useEventStore();

const eventId = parseInt(route.params.id as string);
const showDeleteModal = ref(false);
const deleteLoading = ref(false);

onMounted(async () => {
  await eventStore.fetchEventById(eventId);
});

const confirmDelete = (event: Event) => {
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!eventStore.currentEvent) return;

  deleteLoading.value = true;
  try {
    await eventStore.deleteEvent(eventStore.currentEvent.id);
    router.push("/events");
  } catch (error: any) {
    console.error("Error deleting event:", error);
    // Could add error notification here
  } finally {
    deleteLoading.value = false;
    showDeleteModal.value = false;
  }
};
</script>
