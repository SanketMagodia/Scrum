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
    { value: "bg-red-100", label: "Red" },
    { value: "bg-blue-100", label: "Blue" },
    { value: "bg-green-100", label: "Green" },
    { value: "bg-yellow-100", label: "Yellow" },
    { value: "bg-purple-100", label: "Purple" },
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
            />
          </div>
          <div>
            <Label>Deadline</Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div>
            <Label>Assigned To</Label>
            <Input
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div>
            <Label>Color</Label>
            <Select
              value={color}
              onValueChange={setColor}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit}>Create Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
