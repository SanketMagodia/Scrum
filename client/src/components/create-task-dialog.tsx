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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

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
    setDescription("");
    setDeadline("");
    setAssignedUser("");
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
          <Button onClick={handleSubmit}>Create Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
