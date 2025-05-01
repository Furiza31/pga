export interface Event {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string;
  created_by: number;
  creator_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface EventCreateData {
  title: string;
  description?: string;
  location?: string;
  start_date: string | Date;
  end_date: string | Date;
}

export interface EventUpdateData {
  title?: string;
  description?: string | null;
  location?: string | null;
  start_date?: string | Date;
  end_date?: string | Date;
}
