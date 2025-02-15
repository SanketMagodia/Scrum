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
import { useToast } from "@/hooks/use-toast";
import { addUserToProject } from "@/lib/mongodb";
import { UserPlus } from "lucide-react";

interface CreateUserDialogProps {
  projectId: string;
}

export default function CreateUserDialog({ projectId }: CreateUserDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    if (!username) {
      toast({ title: "Please enter a username", variant: "destructive" });
      return;
    }

    try {
      await addUserToProject(projectId, username);
      setIsOpen(false);
      setUsername("");
      toast({ title: "User added successfully" });
    } catch (error) {
      toast({ title: "Failed to add user", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <Button onClick={handleSubmit}>Add User</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
