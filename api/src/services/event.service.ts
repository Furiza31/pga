import db from "../db";
import { CreateEventDTO, Event, UpdateEventDTO } from "../models/event.model";

class EventService {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    const result = await db.query(`
      SELECT e.*, u.name as creator_name
      FROM events e
      JOIN users u ON e.created_by = u.id
      ORDER BY e.start_date ASC
    `);
    return result.rows;
  }

  // Get event by ID
  async getEventById(id: number): Promise<Event | null> {
    const result = await db.query(
      `
      SELECT e.*, u.name as creator_name
      FROM events e
      JOIN users u ON e.created_by = u.id
      WHERE e.id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as Event;
  }

  // Get upcoming events
  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    const result = await db.query(
      `
      SELECT e.*, u.name as creator_name
      FROM events e
      JOIN users u ON e.created_by = u.id
      WHERE e.start_date > NOW()
      ORDER BY e.start_date ASC
      LIMIT $1
    `,
      [limit]
    );

    return result.rows;
  }

  // Create new event
  async createEvent(eventData: CreateEventDTO, userId: number): Promise<Event> {
    const result = await db.query(
      `
      INSERT INTO events (
        title, 
        description, 
        location, 
        start_date, 
        end_date, 
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [
        eventData.title,
        eventData.description || null,
        eventData.location || null,
        eventData.start_date,
        eventData.end_date,
        userId,
      ]
    );

    return result.rows[0] as Event;
  }

  // Update event
  async updateEvent(
    id: number,
    eventData: UpdateEventDTO
  ): Promise<Event | null> {
    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (eventData.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(eventData.title);
    }

    if (eventData.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(eventData.description);
    }

    if (eventData.location !== undefined) {
      updates.push(`location = $${paramCount++}`);
      values.push(eventData.location);
    }

    if (eventData.start_date !== undefined) {
      updates.push(`start_date = $${paramCount++}`);
      values.push(eventData.start_date);
    }

    if (eventData.end_date !== undefined) {
      updates.push(`end_date = $${paramCount++}`);
      values.push(eventData.end_date);
    }

    // Add update timestamp
    updates.push(`updated_at = NOW()`);

    // If no fields to update
    if (updates.length === 1) {
      const currentEvent = await this.getEventById(id);
      return currentEvent;
    }

    // Add ID as the last parameter
    values.push(id);

    const query = `
      UPDATE events 
      SET ${updates.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as Event;
  }

  // Delete event
  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows.length > 0;
  }
}

export default new EventService();
