import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb+srv://MAFIA:mafia@scrum.jr87n.mongodb.net/?retryWrites=true&w=majority&appName=SCRUM");
const db = client.db("scrumboard");
const tasks = db.collection("tasks");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    try {
      const { projectId } = req.query;
      const projectTasks = await tasks.find({ projectId }).toArray();
      res.json(projectTasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
