export interface Project {
  id: number;
  title: string;
  description: string | null;
  deadline: Date | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  joined_at: Date;
}

export interface CreateProjectDTO {
  title: string;
  description?: string;
  deadline?: string | Date | null;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string | null;
  deadline?: string | Date | null;
}

export interface ProjectWithMembers extends Project {
  members: number[];
}
