import { User } from "./user";
import { Task } from "./task";

export interface Project {
  id: number;
  name: string;
  description?: string;
  ownerId: number; // User who created the project (Admin or Project Manager)
  owner?: User;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

/** DTOs (Data Transfer Objects) */
export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}
