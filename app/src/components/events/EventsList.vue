<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Events</h2>
      <router-link
        to="/events/create"
        v-if="authStore.isAuthenticated"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Event
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-600">Loading events...</div>
    </div>

    <div v-else-if="events.length === 0" class="text-center py-8">
      <div class="text-gray-600">No events found</div>
      <div class="mt-4" v-if="authStore.isAuthenticated">
        <router-link
          to="/events/create"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create your first event
        </router-link>
      </div>
    </div>

    <div v-else class="space-y-6">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
        :showActions="showActions"
        @delete="confirmDelete"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Event</h3>
        <p class="mb-6">
          Are you sure you want to delete "{{ eventToDelete?.title }}"? This
          action cannot be undone.
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
import { useAuthStore } from "@/stores/auth";
import { useEventStore } from "@/stores/events";
import type { Event } from "@/types/event";
import { ref } from "vue";
import EventCard from "./EventCard.vue";

const props = defineProps<{
  events: Event[];
  loading?: boolean;
  showActions?: boolean;
}>();

const authStore = useAuthStore();
const eventStore = useEventStore();

const showDeleteModal = ref(false);
const eventToDelete = ref<Event | null>(null);
const deleteLoading = ref(false);

const confirmDelete = (event: Event) => {
  eventToDelete.value = event;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!eventToDelete.value) return;

  deleteLoading.value = true;
  try {
    await eventStore.deleteEvent(eventToDelete.value.id);
    showDeleteModal.value = false;
    eventToDelete.value = null;
  } catch (error: any) {
    console.error("Error deleting event:", error);
    // Could add error notification here
  } finally {
    deleteLoading.value = false;
  }
};
</script>
