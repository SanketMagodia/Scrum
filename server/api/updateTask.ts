import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb+srv://MAFIA:mafia@scrum.jr87n.mongodb.net/?retryWrites=true&w=majority&appName=SCRUM");
const db = client.db("scrumboard");
const tasks = db.collection("tasks");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "PATCH") {
    try {
      const { taskId } = req.query;
      const updates = req.body;

      const result = await tasks.updateOne({ _id: taskId }, { $set: updates });
      res.json({ success: result.modifiedCount > 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
