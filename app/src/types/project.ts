export interface Project {
  id: number;
  title: string;
  description: string | null;
  deadline: string | null;
  created_by: number;
  creator_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProjectMember {
  id: number;
  name: string;
  email: string;
  joined_at: string;
  is_creator: boolean;
}

export interface ProjectCreateData {
  title: string;
  description?: string;
  deadline?: string | Date | null;
}

export interface ProjectUpdateData {
  title?: string;
  description?: string | null;
  deadline?: string | Date | null;
}
