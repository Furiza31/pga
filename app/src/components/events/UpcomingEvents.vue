<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Upcoming Events
      </h3>
    </div>

    <div v-if="loading" class="p-6 text-center">
      <div class="text-gray-600">Loading events...</div>
    </div>

    <div v-else-if="events.length === 0" class="p-6 text-center">
      <div class="text-gray-600">No upcoming events</div>
    </div>

    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="event in events"
        :key="event.id"
        class="px-4 py-4 sm:px-6 hover:bg-gray-50"
      >
        <div class="flex items-center justify-between">
          <router-link :to="`/events/${event.id}`" class="block">
            <p class="text-sm font-medium text-blue-600 truncate">
              {{ event.title }}
            </p>
            <p class="mt-1 text-xs text-gray-500">
              {{ formatDate(event.start_date) }},
              {{ formatTime(event.start_date) }}
            </p>
            <p
              v-if="event.location"
              class="mt-1 text-xs text-gray-500 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ event.location }}
            </p>
          </router-link>
        </div>
      </div>
    </div>

    <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
      <router-link
        to="/events"
        class="text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        View all events <span aria-hidden="true">&rarr;</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventStore } from "@/stores/events";
import type { Event } from "@/types/event";
import { onMounted, ref } from "vue";

const props = defineProps({
  limit: {
    type: Number,
    default: 5,
  },
});

const eventStore = useEventStore();
const events = ref<Event[]>([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    await eventStore.fetchUpcomingEvents(props.limit);
    events.value = eventStore.upcomingEvents;
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
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
</script>
