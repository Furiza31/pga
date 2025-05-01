import { fetchApi } from "@/lib/api";
import type { Category, Reply, Thread } from "@/types/forum";
import { defineStore } from "pinia";

interface ForumState {
  categories: Category[];
  threads: Thread[];
  currentCategory: Category | null;
  currentThread: Thread | null;
  loading: boolean;
}

export const useForumStore = defineStore("forum", {
  state: (): ForumState => ({
    categories: [],
    threads: [],
    currentCategory: null,
    currentThread: null,
    loading: false,
  }),

  actions: {
    // Categories
    async fetchAllCategories() {
      this.loading = true;
      try {
        const response = await fetchApi<{ categories: Category[] }>(
          "/forum/categories"
        );
        this.categories = response.categories;
        return this.categories;
      } finally {
        this.loading = false;
      }
    },

    async fetchCategoryById(id: number) {
      this.loading = true;
      try {
        const response = await fetchApi<{ category: Category }>(
          `/forum/categories/${id}`
        );
        this.currentCategory = response.category;
        return this.currentCategory;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(categoryData: { name: string; description?: string }) {
      this.loading = true;
      try {
        const response = await fetchApi<{ category: Category }>(
          "/forum/categories",
          {
            method: "POST",
            body: JSON.stringify(categoryData),
          }
        );

        this.categories.push(response.category);
        return response.category;
      } finally {
        this.loading = false;
      }
    },

    async updateCategory(
      id: number,
      categoryData: { name?: string; description?: string }
    ) {
      this.loading = true;
      try {
        const response = await fetchApi<{ category: Category }>(
          `/forum/categories/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(categoryData),
          }
        );

        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.categories[index] = response.category;
        }

        if (this.currentCategory?.id === id) {
          this.currentCategory = response.category;
        }

        return response.category;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id: number) {
      this.loading = true;
      try {
        await fetchApi(`/forum/categories/${id}`, {
          method: "DELETE",
        });

        this.categories = this.categories.filter((c) => c.id !== id);

        if (this.currentCategory?.id === id) {
          this.currentCategory = null;
        }

        return true;
      } finally {
        this.loading = false;
      }
    },

    // Threads
    async fetchThreadsByCategory(categoryId: number) {
      this.loading = true;
      try {
        const response = await fetchApi<{ threads: Thread[] }>(
          `/forum/categories/${categoryId}/threads`
        );
        this.threads = response.threads;
        return this.threads;
      } finally {
        this.loading = false;
      }
    },

    async fetchThreadById(id: number) {
      this.loading = true;
      try {
        const response = await fetchApi<{ thread: Thread }>(
          `/forum/threads/${id}`
        );
        this.currentThread = response.thread;
        return this.currentThread;
      } finally {
        this.loading = false;
      }
    },

    async createThread(threadData: {
      title: string;
      content: string;
      category_id: number;
    }) {
      this.loading = true;
      try {
        const response = await fetchApi<{ thread: Thread }>("/forum/threads", {
          method: "POST",
          body: JSON.stringify(threadData),
        });

        this.threads.push(response.thread);
        return response.thread;
      } finally {
        this.loading = false;
      }
    },

    async updateThread(
      id: number,
      threadData: { title?: string; content?: string; category_id?: number }
    ) {
      this.loading = true;
      try {
        const response = await fetchApi<{ thread: Thread }>(
          `/forum/threads/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(threadData),
          }
        );

        const index = this.threads.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.threads[index] = response.thread;
        }

        if (this.currentThread?.id === id) {
          this.currentThread = response.thread;
        }

        return response.thread;
      } finally {
        this.loading = false;
      }
    },

    async deleteThread(id: number) {
      this.loading = true;
      try {
        await fetchApi(`/forum/threads/${id}`, {
          method: "DELETE",
        });

        this.threads = this.threads.filter((t) => t.id !== id);

        if (this.currentThread?.id === id) {
          this.currentThread = null;
        }

        return true;
      } finally {
        this.loading = false;
      }
    },

    // Replies
    async createReply(replyData: { content: string; thread_id: number }) {
      this.loading = true;
      try {
        const response = await fetchApi<{ reply: Reply }>("/forum/replies", {
          method: "POST",
          body: JSON.stringify(replyData),
        });

        if (
          this.currentThread &&
          this.currentThread.id === replyData.thread_id
        ) {
          if (!this.currentThread.replies) this.currentThread.replies = [];
          this.currentThread.replies.push(response.reply);
          this.currentThread.reply_count =
            (this.currentThread.reply_count || 0) + 1;
        }

        return response.reply;
      } finally {
        this.loading = false;
      }
    },

    async updateReply(id: number, content: string) {
      this.loading = true;
      try {
        const response = await fetchApi<{ reply: Reply }>(
          `/forum/replies/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({ content }),
          }
        );

        if (this.currentThread?.replies) {
          const index = this.currentThread.replies.findIndex(
            (r) => r.id === id
          );
          if (index !== -1) {
            this.currentThread.replies[index] = response.reply;
          }
        }

        return response.reply;
      } finally {
        this.loading = false;
      }
    },

    async deleteReply(id: number) {
      this.loading = true;
      try {
        await fetchApi(`/forum/replies/${id}`, {
          method: "DELETE",
        });

        if (this.currentThread?.replies) {
          this.currentThread.replies = this.currentThread.replies.filter(
            (r) => r.id !== id
          );
          if (
            this.currentThread.reply_count &&
            this.currentThread.reply_count > 0
          ) {
            this.currentThread.reply_count--;
          }
        }

        return true;
      } finally {
        this.loading = false;
      }
    },
  },
});
