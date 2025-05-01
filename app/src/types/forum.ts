export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  thread_count?: number;
}

export interface Thread {
  id: number;
  title: string;
  content: string;
  category_id: number;
  category_name?: string;
  created_by: number;
  creator_name?: string;
  created_at: string;
  updated_at?: string;
  reply_count?: number;
  last_reply_at?: string;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  content: string;
  thread_id: number;
  created_by: number;
  creator_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface CategoryCreateData {
  name: string;
  description?: string;
}

export interface ThreadCreateData {
  title: string;
  content: string;
  category_id: number;
}

export interface ReplyCreateData {
  content: string;
  thread_id: number;
}
