export interface ForumCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface ForumThread {
  id: number;
  title: string;
  content: string;
  category_id: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface ForumReply {
  id: number;
  content: string;
  thread_id: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface CreateThreadDTO {
  title: string;
  content: string;
  category_id: number;
}

export interface CreateReplyDTO {
  content: string;
  thread_id: number;
}

export interface ThreadWithReplies extends ForumThread {
  replies: ForumReply[];
  author?: {
    id: number;
    name: string;
  };
}

export interface ReplyWithAuthor extends ForumReply {
  author?: {
    id: number;
    name: string;
  };
}
