export interface Event {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  start_date: Date;
  end_date: Date;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEventDTO {
  title: string;
  description?: string;
  location?: string;
  start_date: string | Date;
  end_date: string | Date;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string | null;
  location?: string | null;
  start_date?: string | Date;
  end_date?: string | Date;
}
