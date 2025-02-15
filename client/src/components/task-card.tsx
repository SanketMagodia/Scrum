import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@shared/schema";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteTask, updateTask } from "@/lib/mongodb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onUpdate: (task: Task) => void;
}

export default function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      onDelete(task._id);
      toast({ title: "Task deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete task", variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    try {
      await updateTask(task._id, editedTask);
      onUpdate(editedTask);
      setIsEditing(false);
      toast({ title: "Task updated successfully" });
    } catch (error) {
      toast({ title: "Failed to update task", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className="flex gap-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={editedTask.title}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editedTask.description}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, description: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Deadline</Label>
                    <Input
                      type="date"
                      value={editedTask.deadline}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, deadline: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Assigned To</Label>
                    <Input
                      value={editedTask.assignedUser}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, assignedUser: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleUpdate}>Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">{task.description}</p>
        <div className="mt-4 flex justify-between text-sm">
          <span>Assigned: {task.assignedUser}</span>
          <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
