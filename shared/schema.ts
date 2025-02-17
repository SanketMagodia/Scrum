import { z } from "zod";

export const resourceSchema = z.object({
  _id: z.string(),
  name: z.string(),
  value: z.string(),
});
export const projectSchema = z.object({
  _id: z.string(),
  projectId: z.string(),
  password: z.string(),
  users: z.array(z.string()),
  resources: z.array(resourceSchema).optional(),
});

export const taskSchema = z.object({
  _id: z.string(),
  idd: z.string(),
  projectId: z.string(),
  title: z.string(),
  description: z.string(),
  deadline: z.string(),
  assignedUser: z.string(),
  status: z.enum(["pending", "ongoing", "completed"]),
  color: z.string().optional()
});

export type Project = z.infer<typeof projectSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Resource = z.infer<typeof resourceSchema>;