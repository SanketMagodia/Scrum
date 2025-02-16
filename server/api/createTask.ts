import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from "mongodb";
import * as crypto from "crypto";

const client = new MongoClient("mongodb+srv://MAFIA:mafia@scrum.jr87n.mongodb.net/?retryWrites=true&w=majority&appName=SCRUM");
const db = client.db("scrumboard");
const tasks = db.collection("tasks");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      const task = req.body;
      const result = await tasks.insertOne({
        ...task,
        _id: crypto.randomUUID(),
        color: task.color || "#ffffff",
      });
      res.json(await tasks.findOne({ _id: result.insertedId }));
    } catch (error) {
      res.status(500).json({ message: "Failed to create task" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
