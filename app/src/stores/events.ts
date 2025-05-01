import { fetchApi } from "@/lib/api";
import type { Event, EventCreateData, EventUpdateData } from "@/types/event";
import { defineStore } from "pinia";

interface EventState {
  events: Event[];
  upcomingEvents: Event[];
  currentEvent: Event | null;
  loading: boolean;
}

export const useEventStore = defineStore("events", {
  state: (): EventState => ({
    events: [],
    upcomingEvents: [],
    currentEvent: null,
    loading: false,
  }),

  actions: {
    async fetchAllEvents() {
      this.loading = true;
      try {
        const response = await fetchApi<{ events: Event[] }>("/events");
        this.events = response.events;
        return this.events;
      } finally {
        this.loading = false;
      }
    },

    async fetchUpcomingEvents(limit = 10) {
      this.loading = true;
      try {
        const response = await fetchApi<{ events: Event[] }>(
          `/events/upcoming?limit=${limit}`
        );
        this.upcomingEvents = response.events;
        return this.upcomingEvents;
      } finally {
        this.loading = false;
      }
    },

    async fetchEventById(id: number) {
      this.loading = true;
      try {
        const response = await fetchApi<{ event: Event }>(`/events/${id}`);
        this.currentEvent = response.event;
        return this.currentEvent;
      } finally {
        this.loading = false;
      }
    },

    async createEvent(eventData: EventCreateData) {
      this.loading = true;
      try {
        const response = await fetchApi<{ event: Event }>("/events", {
          method: "POST",
          body: JSON.stringify(eventData),
        });

        this.events.push(response.event);
        return response.event;
      } finally {
        this.loading = false;
      }
    },

    async updateEvent(id: number, eventData: EventUpdateData) {
      this.loading = true;
      try {
        const response = await fetchApi<{ event: Event }>(`/events/${id}`, {
          method: "PUT",
          body: JSON.stringify(eventData),
        });

        // Update local state
        const index = this.events.findIndex((e) => e.id === id);
        if (index !== -1) {
          this.events[index] = response.event;
        }

        if (this.currentEvent?.id === id) {
          this.currentEvent = response.event;
        }

        return response.event;
      } finally {
        this.loading = false;
      }
    },

    async deleteEvent(id: number) {
      this.loading = true;
      try {
        await fetchApi(`/events/${id}`, {
          method: "DELETE",
        });

        // Update local state
        this.events = this.events.filter((e) => e.id !== id);

        if (this.currentEvent?.id === id) {
          this.currentEvent = null;
        }

        return true;
      } finally {
        this.loading = false;
      }
    },
  },
});
