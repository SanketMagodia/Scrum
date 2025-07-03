import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createTask } from "@/lib/mongodb";
import { Task } from "@shared/schema";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateTaskDialogProps {
  projectId: string;
  onTaskCreated: (task: Task) => void;
}

export default function CreateTaskDialog({
  projectId,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // Setting default values
  const today = new Date().toISOString().split("T")[0];
  const defaultColor = "bg-blue-100";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("-");
  const [deadline, setDeadline] = useState(today);
  const [assignedUser, setAssignedUser] = useState("Me");
  const [color, setColor] = useState(defaultColor); 

  const colorOptions = [
  { value: "bg-red-400", label: "Red" },
  { value: "bg-blue-400", label: "Blue" },
  { value: "bg-green-400", label: "Green" },
  { value: "bg-yellow-300", label: "Yellow" },
  { value: "bg-purple-400", label: "Purple" },
];

  const handleSubmit = async () => {
    if (!title || !description || !deadline || !assignedUser) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      const task = await createTask({
        projectId,
        title,
        description,
        deadline,
        assignedUser,
        status: "pending",
        color,
      });
      onTaskCreated(task);
      setIsOpen(false);
      resetForm();
      toast({ title: "Task created successfully" });
    } catch (error) {
      toast({ title: "Failed to create task", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("-");
    setDeadline(today);
    setAssignedUser("Me");
    setColor(defaultColor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-400 text-white hover:bg-blue-500 transition">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white rounded-xl border border-gray-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Title</Label>
            <Input
              className="bg-gray-800 text-white border border-gray-700 rounded focus:ring-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          <div>
            <Label className="text-gray-300">Description</Label>
            <Textarea
              className="bg-gray-800 text-white border border-gray-700 rounded focus:ring-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
            />
          </div>
          <div>
            <Label className="text-gray-300">Deadline</Label>
            <Input
              className="bg-gray-800 text-white border border-gray-700 rounded focus:ring-blue-400"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-gray-300">Assigned To</Label>
            <Input
              className="bg-gray-800 text-white border border-gray-700 rounded focus:ring-blue-400"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div>
            <Label className="text-gray-300">Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="bg-gray-800 text-white border border-gray-700 rounded focus:ring-blue-400">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border border-gray-700">
                {colorOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-gray-800"
                  >
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 align-middle ${option.value}`}
                    ></span>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-400 text-white hover:bg-blue-500 rounded transition"
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
