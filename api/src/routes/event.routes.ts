import express from "express";
import eventController from "../controllers/event.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", eventController.getAllEvents);
router.get("/upcoming", eventController.getUpcomingEvents);
router.get("/:id", eventController.getEventById);

// Protected routes - require authentication
router.post("/", authenticate, eventController.createEvent);
router.put("/:id", authenticate, eventController.updateEvent);
router.delete("/:id", authenticate, eventController.deleteEvent);

export default router;
