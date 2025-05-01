import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/Home.vue"),
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("@/views/user/Profile.vue"),
        },
        // Event routes
        {
          path: "events",
          name: "events",
          component: () => import("@/views/events/EventsList.vue"),
        },
        {
          path: "events/create",
          name: "eventCreate",
          component: () => import("@/views/events/EventCreate.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "events/:id",
          name: "eventDetail",
          component: () => import("@/views/events/EventDetail.vue"),
        },
        {
          path: "events/:id/edit",
          name: "eventEdit",
          component: () => import("@/views/events/EventEdit.vue"),
          meta: { requiresAuth: true },
        },
        // Project routes
        {
          path: "projects",
          name: "projects",
          component: () => import("@/views/projects/ProjectsList.vue"),
        },
        {
          path: "projects/my-projects",
          name: "myProjects",
          component: () => import("@/views/projects/MyProjects.vue"),
        },
        {
          path: "projects/create",
          name: "projectCreate",
          component: () => import("@/views/projects/ProjectCreate.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "projects/:id",
          name: "projectDetail",
          component: () => import("@/views/projects/ProjectDetail.vue"),
        },
        {
          path: "projects/:id/edit",
          name: "projectEdit",
          component: () => import("@/views/projects/ProjectEdit.vue"),
          meta: { requiresAuth: true },
        },
        // Forum routes
        {
          path: "forum",
          name: "forum",
          component: () => import("@/views/forum/ForumHome.vue"),
        },
        {
          path: "forum/categories/:id",
          name: "forumCategory",
          component: () => import("@/views/forum/CategoryView.vue"),
        },
        {
          path: "forum/threads/create",
          name: "threadCreate",
          component: () => import("@/views/forum/ThreadCreate.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "forum/threads/:id",
          name: "threadView",
          component: () => import("@/views/forum/ThreadView.vue"),
        },
        {
          path: "forum/threads/:id/edit",
          name: "threadEdit",
          component: () => import("@/views/forum/ThreadEdit.vue"),
          meta: { requiresAuth: true },
        },
        // Admin routes
        {
          path: "admin/users",
          name: "users",
          component: () => import("@/views/admin/Users.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "admin/users/create",
          name: "userCreate",
          component: () => import("@/views/admin/UserCreate.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "admin/users/:id",
          name: "userEdit",
          component: () => import("@/views/admin/UserEdit.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "admin/forum/categories",
          name: "adminForumCategories",
          component: () => import("@/views/admin/ForumCategories.vue"),
          meta: { requiresAdmin: true },
        },
        // Additional routes will be added in later phases
      ],
    },
    {
      path: "/auth",
      component: () => import("@/layouts/AuthLayout.vue"),
      meta: { guestOnly: true },
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("@/views/auth/Login.vue"),
        },
        {
          path: "register",
          name: "register",
          component: () => import("@/views/auth/Register.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "login" });
  }

  if (
    to.meta.requiresAdmin &&
    (!authStore.isAuthenticated || !authStore.isAdmin)
  ) {
    return next({ name: "home" });
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: "home" });
  }

  next();
});

export default router;
