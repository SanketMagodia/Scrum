import { Project, Task } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function createProject(projectId: string, password: string): Promise<Project> {
  const res = await apiRequest("POST", "/api/project", { projectId, password });
  return res.json();
}

export async function joinProject(projectId: string, password: string): Promise<Project | null> {
  const res = await apiRequest("POST", "/api/project/join", { projectId, password });
  if (res.status === 404) return null;
  return res.json();
}

export async function addUserToProject(projectId: string, username: string): Promise<boolean> {
  const res = await apiRequest("POST", "/api/project/user", { projectId, username });
  const { success } = await res.json();
  return success;
}

export async function createTask(task: Omit<Task, "_id">): Promise<Task> {
  const res = await apiRequest("POST", "/api/task", task);
  return res.json();
}

export async function getTasks(projectId: string): Promise<Task[]> {
  const res = await apiRequest("GET", `/api/tasks/${projectId}`, undefined);
  return res.json();
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<boolean> {
  const res = await apiRequest("PATCH", `/api/task/${taskId}`, updates);
  const { success } = await res.json();
  return success;
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const res = await apiRequest("DELETE", `/api/task/${taskId}`, undefined);
  const { success } = await res.json();
  return success;
}