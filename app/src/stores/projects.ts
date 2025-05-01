import { fetchApi } from "@/lib/api";
import { User } from "@/types/auth";
import {
  Project,
  ProjectCreateData,
  ProjectMember,
  ProjectUpdateData,
} from "@/types/project";
import { defineStore } from "pinia";

interface ProjectsState {
  projects: Project[];
  myProjects: Project[];
  currentProject: Project | null;
  projectMembers: ProjectMember[];
  loading: boolean;
}

export const useProjectsStore = defineStore("projects", {
  state: (): ProjectsState => ({
    projects: [],
    myProjects: [],
    currentProject: null,
    projectMembers: [],
    loading: false,
  }),

  actions: {
    async fetchAllProjects() {
      this.loading = true;
      try {
        const response = await fetchApi<{ projects: Project[] }>("/projects");
        this.projects = response.projects;
        return this.projects;
      } finally {
        this.loading = false;
      }
    },

    async fetchMyProjects() {
      this.loading = true;
      try {
        const response = await fetchApi<{ projects: Project[] }>(
          "/projects/my-projects"
        );
        this.myProjects = response.projects;
        return this.myProjects;
      } finally {
        this.loading = false;
      }
    },

    async fetchProjectById(id: number) {
      this.loading = true;
      try {
        const response = await fetchApi<{ project: Project }>(
          `/projects/${id}`
        );
        this.currentProject = response.project;
        return this.currentProject;
      } finally {
        this.loading = false;
      }
    },

    async fetchProjectMembers(projectId: number) {
      this.loading = true;
      try {
        const response = await fetchApi<{ members: ProjectMember[] }>(
          `/projects/${projectId}/members`
        );
        this.projectMembers = response.members;
        return this.projectMembers;
      } finally {
        this.loading = false;
      }
    },

    async createProject(projectData: ProjectCreateData) {
      this.loading = true;
      try {
        const response = await fetchApi<{ project: Project }>("/projects", {
          method: "POST",
          body: JSON.stringify(projectData),
        });

        this.projects.push(response.project);
        this.myProjects.push(response.project);
        return response.project;
      } finally {
        this.loading = false;
      }
    },

    async updateProject(id: number, projectData: ProjectUpdateData) {
      this.loading = true;
      try {
        const response = await fetchApi<{ project: Project }>(
          `/projects/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(projectData),
          }
        );

        // Update in local state
        const updateInArray = (arr: Project[]) => {
          const index = arr.findIndex((p) => p.id === id);
          if (index !== -1) {
            arr[index] = response.project;
          }
        };

        updateInArray(this.projects);
        updateInArray(this.myProjects);

        if (this.currentProject?.id === id) {
          this.currentProject = response.project;
        }

        return response.project;
      } finally {
        this.loading = false;
      }
    },

    async deleteProject(id: number) {
      this.loading = true;
      try {
        await fetchApi(`/projects/${id}`, {
          method: "DELETE",
        });

        // Update local state
        this.projects = this.projects.filter((p) => p.id !== id);
        this.myProjects = this.myProjects.filter((p) => p.id !== id);

        if (this.currentProject?.id === id) {
          this.currentProject = null;
        }

        return true;
      } finally {
        this.loading = false;
      }
    },

    async addProjectMember(projectId: number, userId: number) {
      this.loading = true;
      try {
        await fetchApi(`/projects/${projectId}/members`, {
          method: "POST",
          body: JSON.stringify({ userId }),
        });

        // Refresh member list
        return this.fetchProjectMembers(projectId);
      } finally {
        this.loading = false;
      }
    },

    async removeProjectMember(projectId: number, userId: number) {
      this.loading = true;
      try {
        await fetchApi(`/projects/${projectId}/members/${userId}`, {
          method: "DELETE",
        });

        // Update local state
        this.projectMembers = this.projectMembers.filter(
          (m) => m.id !== userId
        );
        return true;
      } finally {
        this.loading = false;
      }
    },
    async searchUsers(query: string) {
      this.loading = true;
      try {
        const response = await fetchApi<{ users: User[] }>(
          `/projects/users/search/${query}`
        );
        return response.users;
      } finally {
        this.loading = false;
      }
    },
  },
});
