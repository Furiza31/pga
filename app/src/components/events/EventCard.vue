<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ event.title }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            {{ formatDate(event.start_date) }} -
            {{ formatTime(event.start_date) }} to
            {{ formatTime(event.end_date) }}
          </p>
        </div>
        <div
          class="flex gap-2"
          v-if="
            showActions &&
            (authStore.isAdmin || authStore.user?.id === event.created_by)
          "
        >
          <router-link
            :to="`/events/${event.id}/edit`"
            class="text-blue-600 hover:text-blue-900"
          >
            Edit
          </router-link>
          <button
            @click="$emit('delete', event)"
            class="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      </div>

      <div class="mt-3">
        <p class="text-sm text-gray-600" v-if="event.description">
          {{ truncateText(event.description, 150) }}
        </p>
      </div>

      <div class="mt-3 flex items-center" v-if="event.location">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-500 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500">{{ event.location }}</span>
      </div>

      <div class="mt-4">
        <router-link
          :to="`/events/${event.id}`"
          class="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View details <span aria-hidden="true">&rarr;</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import type { Event } from "@/types/event";

const authStore = useAuthStore();

const props = defineProps<{
  event: Event;
  showActions?: boolean;
}>();

defineEmits(["delete"]);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const truncateText = (text: string | null, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
</script>
