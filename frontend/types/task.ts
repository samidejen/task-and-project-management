import { User } from "./user";
import { Project } from "./project";

/** Task entity */
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  projectId: number; // The project this task belongs to
  assignedTo?: number; // User ID assigned to this task
  assignee?: User; // Optional: populated user info
  project?: Project; // Optional: populated project info
  createdAt: string;
  updatedAt: string;
}

/** DTOs (Data Transfer Objects) */

/** Used when creating a new task */
export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId: number;
  assignedTo?: number;
}

/** Used when updating an existing task */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
  assignedTo?: number;
}
