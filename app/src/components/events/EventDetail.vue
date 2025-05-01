<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div v-if="loading" class="p-6 text-center">
      <div class="text-gray-600">Loading event details...</div>
    </div>

    <template v-else>
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ event.title }}
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Created by {{ event.creator_name || "Unknown" }}
          </p>
        </div>

        <div class="flex space-x-3" v-if="isEventOwner || authStore.isAdmin">
          <router-link
            :to="`/events/${event.id}/edit`"
            class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Edit
          </router-link>
          <button
            @click="$emit('delete', event)"
            class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      <div class="border-t border-gray-200">
        <dl>
          <div
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-500">Date & Time</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ formatDate(event.start_date) }}
              {{ formatTime(event.start_date) }} -
              {{ formatTime(event.end_date) }}
            </dd>
          </div>

          <div
            v-if="event.location"
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-500">Location</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ event.location }}
            </dd>
          </div>

          <div
            v-if="event.description"
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-500">Description</dt>
            <dd
              class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line"
            >
              {{ event.description }}
            </dd>
          </div>

          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-500">Created</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ formatFullDate(event.created_at) }}
            </dd>
          </div>

          <div
            v-if="event.updated_at && event.updated_at !== event.created_at"
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ formatFullDate(event.updated_at) }}
            </dd>
          </div>
        </dl>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import type { Event } from "@/types/event";
import { computed } from "vue";

const props = defineProps<{
  event: Event;
  loading?: boolean;
}>();

const authStore = useAuthStore();

defineEmits(["delete"]);

const isEventOwner = computed(() => {
  return (
    props.event &&
    authStore.user &&
    props.event.created_by === authStore.user.id
  );
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
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

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
