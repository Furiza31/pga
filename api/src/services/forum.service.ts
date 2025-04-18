import db from "../db";
import {
  CreateCategoryDTO,
  CreateReplyDTO,
  CreateThreadDTO,
  ForumCategory,
  ForumReply,
  ForumThread,
  ReplyWithAuthor,
  ThreadWithReplies,
} from "../models/forum.model";

class ForumService {
  // Categories
  async getAllCategories(): Promise<ForumCategory[]> {
    const result = await db.query(`
      SELECT * FROM forum_categories
      ORDER BY name ASC
    `);
    return result.rows;
  }

  async getCategoryById(id: number): Promise<ForumCategory | null> {
    const result = await db.query(
      "SELECT * FROM forum_categories WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as ForumCategory;
  }

  async createCategory(
    categoryData: CreateCategoryDTO
  ): Promise<ForumCategory> {
    const result = await db.query(
      `
      INSERT INTO forum_categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `,
      [categoryData.name, categoryData.description || null]
    );

    return result.rows[0] as ForumCategory;
  }

  async updateCategory(
    id: number,
    categoryData: Partial<CreateCategoryDTO>
  ): Promise<ForumCategory | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (categoryData.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(categoryData.name);
    }

    if (categoryData.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(categoryData.description);
    }

    if (updates.length === 0) {
      const currentCategory = await this.getCategoryById(id);
      return currentCategory;
    }

    values.push(id);

    const query = `
      UPDATE forum_categories 
      SET ${updates.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as ForumCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM forum_categories WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows.length > 0;
  }

  // Threads
  async getThreadsByCategory(categoryId: number): Promise<ForumThread[]> {
    const result = await db.query(
      `
      SELECT t.*, 
             u.name as author_name,
             (SELECT COUNT(*) FROM forum_replies WHERE thread_id = t.id) as reply_count
      FROM forum_threads t
      JOIN users u ON t.created_by = u.id
      WHERE t.category_id = $1
      ORDER BY t.created_at DESC
    `,
      [categoryId]
    );

    return result.rows;
  }

  async getThreadById(id: number): Promise<ThreadWithReplies | null> {
    // Get thread with author info
    const threadResult = await db.query(
      `
      SELECT t.*, u.id as author_id, u.name as author_name
      FROM forum_threads t
      JOIN users u ON t.created_by = u.id
      WHERE t.id = $1
    `,
      [id]
    );

    if (threadResult.rows.length === 0) {
      return null;
    }

    const thread = threadResult.rows[0] as ForumThread;

    // Format thread with author info
    const threadWithAuthor: ThreadWithReplies = {
      ...thread,
      replies: [],
      author: {
        id: threadResult.rows[0].author_id,
        name: threadResult.rows[0].author_name,
      },
    };

    // Get replies with author info
    const repliesResult = await db.query(
      `
      SELECT r.*, u.id as author_id, u.name as author_name
      FROM forum_replies r
      JOIN users u ON r.created_by = u.id
      WHERE r.thread_id = $1
      ORDER BY r.created_at ASC
    `,
      [id]
    );

    // Format replies with author info
    const repliesWithAuthors: ReplyWithAuthor[] = repliesResult.rows.map(
      (row) => ({
        ...row,
        author: {
          id: row.author_id,
          name: row.author_name,
        },
      })
    );

    threadWithAuthor.replies = repliesWithAuthors;

    return threadWithAuthor;
  }

  async createThread(
    threadData: CreateThreadDTO,
    userId: number
  ): Promise<ForumThread> {
    const result = await db.query(
      `
      INSERT INTO forum_threads (title, content, category_id, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [threadData.title, threadData.content, threadData.category_id, userId]
    );

    return result.rows[0] as ForumThread;
  }

  async updateThread(
    id: number,
    threadData: Partial<CreateThreadDTO>
  ): Promise<ForumThread | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (threadData.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(threadData.title);
    }

    if (threadData.content !== undefined) {
      updates.push(`content = $${paramCount++}`);
      values.push(threadData.content);
    }

    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) {
      const currentThread = await this.getThreadById(id);
      return currentThread as ForumThread;
    }

    values.push(id);

    const query = `
      UPDATE forum_threads 
      SET ${updates.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as ForumThread;
  }

  async deleteThread(id: number): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM forum_threads WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows.length > 0;
  }

  // Replies
  async createReply(
    replyData: CreateReplyDTO,
    userId: number
  ): Promise<ForumReply> {
    const result = await db.query(
      `
      INSERT INTO forum_replies (content, thread_id, created_by)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [replyData.content, replyData.thread_id, userId]
    );

    return result.rows[0] as ForumReply;
  }

  async updateReply(id: number, content: string): Promise<ForumReply | null> {
    const result = await db.query(
      `
      UPDATE forum_replies 
      SET content = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *
    `,
      [content, id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as ForumReply;
  }

  async deleteReply(id: number): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM forum_replies WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows.length > 0;
  }

  async getReplyById(id: number): Promise<ForumReply | null> {
    const result = await db.query("SELECT * FROM forum_replies WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as ForumReply;
  }
}

export default new ForumService();
