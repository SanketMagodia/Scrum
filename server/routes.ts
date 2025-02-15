import type { Express } from "express";
import { createServer, type Server } from "http";
import { MongoClient } from "mongodb";
import { Project, Task } from "@shared/schema";
import * as crypto from 'crypto';

if (!process.env.VITE_MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const client = new MongoClient(process.env.VITE_MONGODB_URI);
const db = client.db("scrumboard");
const projects = db.collection<Project>("projects");
const tasks = db.collection<Task>("tasks");

export async function registerRoutes(app: Express): Promise<Server> {
  // Project routes
  app.post("/api/project", async (req, res) => {
    try {
      const { projectId, password } = req.body;
      const project = await projects.insertOne({
        projectId,
        password,
        users: [],
        _id: crypto.randomUUID(),
      });
      res.json(await projects.findOne({ _id: project.insertedId }));
    } catch (error) {
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.post("/api/project/join", async (req, res) => {
    try {
      const { projectId, password } = req.body;
      const project = await projects.findOne({ projectId, password });
      if (!project) {
        return res.status(404).json({ message: "Invalid project ID or password" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to join project" });
    }
  });

  app.post("/api/project/user", async (req, res) => {
    try {
      const { projectId, username } = req.body;
      const result = await projects.updateOne(
        { projectId },
        { $addToSet: { users: username } }
      );
      res.json({ success: result.modifiedCount > 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to add user" });
    }
  });

  // Task routes
  app.post("/api/task", async (req, res) => {
    try {
      const task = req.body;
      const result = await tasks.insertOne({
        ...task,
        _id: crypto.randomUUID(),
      });
      res.json(await tasks.findOne({ _id: result.insertedId }));
    } catch (error) {
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.get("/api/tasks/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      const projectTasks = await tasks.find({ projectId }).toArray();
      res.json(projectTasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.patch("/api/task/:taskId", async (req, res) => {
    try {
      const { taskId } = req.params;
      const updates = req.body;
      const result = await tasks.updateOne(
        { _id: taskId },
        { $set: updates }
      );
      res.json({ success: result.modifiedCount > 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/task/:taskId", async (req, res) => {
    try {
      const { taskId } = req.params;
      const result = await tasks.deleteOne({ _id: taskId });
      res.json({ success: result.deletedCount > 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}