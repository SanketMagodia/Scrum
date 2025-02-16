import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from "mongodb";
import * as crypto from "crypto";

const client = new MongoClient("mongodb+srv://MAFIA:mafia@scrum.jr87n.mongodb.net/?retryWrites=true&w=majority&appName=SCRUM");
const db = client.db("scrumboard");
const projects = db.collection("projects");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
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
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
