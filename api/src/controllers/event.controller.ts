import { Request, Response } from "express";
import { z } from "zod";
import eventService from "../services/event.service";

// Validation schemas
const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().or(z.date()),
  end_date: z.string().or(z.date()),
});

const updateEventSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  start_date: z.string().or(z.date()).optional(),
  end_date: z.string().or(z.date()).optional(),
});

class EventController {
  // Get all events
  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();
      return res.json({ events });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving events",
      });
    }
  }

  // Get upcoming events
  async getUpcomingEvents(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const events = await eventService.getUpcomingEvents(limit);
      return res.json({ events });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving upcoming events",
      });
    }
  }

  // Get event by ID
  async getEventById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const event = await eventService.getEventById(id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      return res.json({ event });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error retrieving event",
      });
    }
  }

  // Create new event
  async createEvent(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = createEventSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      const userId = req.user.id;
      const event = await eventService.createEvent(req.body, userId);

      return res.status(201).json({
        message: "Event created successfully",
        event,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error creating event",
      });
    }
  }

  // Update event
  async updateEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      // Validate request body
      const validationResult = updateEventSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      // Check if event exists and if user has permission to update
      const existingEvent = await eventService.getEventById(id);

      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Only creator or admin can update event
      if (
        existingEvent.created_by !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "You do not have permission to update this event",
        });
      }

      const updatedEvent = await eventService.updateEvent(id, req.body);

      return res.json({
        message: "Event updated successfully",
        event: updatedEvent,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error updating event",
      });
    }
  }

  // Delete event
  async deleteEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      // Check if event exists and if user has permission to delete
      const existingEvent = await eventService.getEventById(id);

      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Only creator or admin can delete event
      if (
        existingEvent.created_by !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "You do not have permission to delete this event",
        });
      }

      const success = await eventService.deleteEvent(id);

      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }

      return res.json({ message: "Event deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error deleting event",
      });
    }
  }
}

export default new EventController();
