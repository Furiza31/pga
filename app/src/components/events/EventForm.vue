<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white shadow-md rounded-lg p-6"
  >
    <div class="grid grid-cols-1 gap-6">
      <!-- Title Field -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700"
          >Event Title</label
        >
        <input
          v-model="form.title"
          type="text"
          id="title"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.title }"
          required
        />
        <p v-if="errors.title" class="mt-1 text-sm text-red-600">
          {{ errors.title }}
        </p>
      </div>

      <!-- Description Field -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700"
          >Description</label
        >
        <textarea
          v-model="form.description"
          id="description"
          rows="4"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- Location Field -->
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700"
          >Location</label
        >
        <input
          v-model="form.location"
          type="text"
          id="location"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        />
      </div>

      <!-- Date and Time Fields -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            for="start_date"
            class="block text-sm font-medium text-gray-700"
            >Start Date & Time</label
          >
          <input
            v-model="form.start_date"
            type="datetime-local"
            id="start_date"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-500': errors.start_date }"
            required
          />
          <p v-if="errors.start_date" class="mt-1 text-sm text-red-600">
            {{ errors.start_date }}
          </p>
        </div>

        <div>
          <label for="end_date" class="block text-sm font-medium text-gray-700"
            >End Date & Time</label
          >
          <input
            v-model="form.end_date"
            type="datetime-local"
            id="end_date"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-500': errors.end_date }"
            required
          />
          <p v-if="errors.end_date" class="mt-1 text-sm text-red-600">
            {{ errors.end_date }}
          </p>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="button"
          @click="$router.back()"
          class="mr-3 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          :disabled="loading"
        >
          {{
            loading
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
              ? "Save Changes"
              : "Create Event"
          }}
        </button>
      </div>

      <!-- Form Error -->
      <div v-if="formError" class="text-red-600 text-center">
        {{ formError }}
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useEventStore } from "@/stores/events";
import type { Event, EventCreateData, EventUpdateData } from "@/types/event";
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  eventId?: number;
  event?: Event;
}>();

const router = useRouter();
const eventStore = useEventStore();

const isEditing = computed(() => !!props.eventId || !!props.event);
const loading = ref(false);
const formError = ref("");

const form = reactive({
  title: "",
  description: "",
  location: "",
  start_date: "",
  end_date: "",
});

const errors = reactive({
  title: "",
  start_date: "",
  end_date: "",
});

onMounted(() => {
  if (props.event) {
    initializeFormFromEvent(props.event);
  } else if (props.eventId) {
    loadEvent(props.eventId);
  } else {
    // Set default times for new events (e.g., starting in 1 hour, lasting 1 hour)
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    form.start_date = formatDateForInput(oneHourLater);
    form.end_date = formatDateForInput(twoHoursLater);
  }
});

const loadEvent = async (id: number) => {
  loading.value = true;
  try {
    const event = await eventStore.fetchEventById(id);
    if (event) {
      initializeFormFromEvent(event);
    }
  } catch (error: any) {
    formError.value = error.message || "Failed to load event";
  } finally {
    loading.value = false;
  }
};

const initializeFormFromEvent = (event: Event) => {
  form.title = event.title || "";
  form.description = event.description || "";
  form.location = event.location || "";
  form.start_date = formatDateForInput(new Date(event.start_date));
  form.end_date = formatDateForInput(new Date(event.end_date));
};

const formatDateForInput = (date: Date): string => {
  // Format date as YYYY-MM-DDThh:mm (format required by datetime-local input)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.title = "";
  errors.start_date = "";
  errors.end_date = "";
  formError.value = "";

  // Validate title
  if (!form.title.trim()) {
    errors.title = "Title is required";
    isValid = false;
  }

  // Validate dates
  const startDate = new Date(form.start_date);
  const endDate = new Date(form.end_date);

  if (isNaN(startDate.getTime())) {
    errors.start_date = "Start date is required";
    isValid = false;
  }

  if (isNaN(endDate.getTime())) {
    errors.end_date = "End date is required";
    isValid = false;
  } else if (endDate <= startDate) {
    errors.end_date = "End date must be after start date";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  formError.value = "";

  try {
    const eventData: EventCreateData | EventUpdateData = {
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      start_date: form.start_date,
      end_date: form.end_date,
    };

    if (isEditing.value) {
      const eventId = props.eventId || props.event?.id;
      if (!eventId) throw new Error("Event ID is missing");
      await eventStore.updateEvent(eventId, eventData);
    } else {
      await eventStore.createEvent(eventData as EventCreateData);
    }

    router.push("/events");
  } catch (error: any) {
    formError.value =
      error.message || "Failed to save event. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
