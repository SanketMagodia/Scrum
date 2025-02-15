import { z } from "zod";

export const projectSchema = z.object({
  _id: z.string(),
  projectId: z.string(),
  password: z.string(),
  users: z.array(z.string()),
});

export const taskSchema = z.object({
  _id: z.string(),
  projectId: z.string(),
  title: z.string(),
  description: z.string(),
  deadline: z.string(),
  assignedUser: z.string(),
  status: z.enum(["pending", "ongoing", "completed"]),
});

export type Project = z.infer<typeof projectSchema>;
export type Task = z.infer<typeof taskSchema>;
