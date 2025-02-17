import React, { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onUpdate: (task: Task) => void;
}

const colorOptions = [
  { value: "bg-red-100", label: "Red" },
  { value: "bg-blue-100", label: "Blue" },
  { value: "bg-green-100", label: "Green" },
  { value: "bg-yellow-100", label: "Yellow" },
  { value: "bg-purple-100", label: "Purple" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

export default function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  useEffect(() => {
    const storedColor = localStorage.getItem(`taskColor_${task.idd}`);
    if (storedColor) {
      setEditedTask(prevTask => ({ ...prevTask, color: storedColor }));
    }
  }, [task.idd]);

  const handleDelete = async () => {
    try {
      await deleteTask(task.idd);
      onDelete(task.idd);
      localStorage.removeItem(`taskColor_${task.idd}`);
      toast({ title: "Task deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete task", variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    try {
      await updateTask(task.idd, editedTask);
      onUpdate(editedTask);
      setIsEditing(false);
      localStorage.setItem(`taskColor_${task.idd}`, editedTask.color || '');
      toast({ title: "Task updated successfully" });
    } catch (error) {
      toast({ title: "Failed to update task", variant: "destructive" });
    }
  };

  const handleColorChange = (color: string) => {
    setEditedTask(prevTask => ({ ...prevTask, color }));
    localStorage.setItem(`taskColor_${task.idd}`, color);
  };

  return (
    <Card className={editedTask.color || "bg-white"}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{editedTask.title}</CardTitle>
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
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={editedTask.status}
                      onValueChange={(value) => setEditedTask({ ...editedTask, status: value as Task['status'] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Color</Label>
                    <Select
                      value={editedTask.color || ''}
                      onValueChange={handleColorChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
        <p className="text-sm text-muted-foreground">{editedTask.description}</p>
        <div className="mt-4 flex justify-between text-sm">
          <span>Assigned: {editedTask.assignedUser}</span>
          <span>Due: {new Date(editedTask.deadline).toLocaleDateString()}</span>
        </div>
        <div className="mt-2 text-sm">
          <span>Status: {editedTask.status}</span>
        </div>
      </CardContent>
    </Card>
  );
}
