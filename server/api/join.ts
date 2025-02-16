import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb+srv://MAFIA:mafia@scrum.jr87n.mongodb.net/?retryWrites=true&w=majority&appName=SCRUM");
const db = client.db("scrumboard");
const projects = db.collection("projects");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
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
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
