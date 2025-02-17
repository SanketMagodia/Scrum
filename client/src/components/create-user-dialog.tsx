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
    localStorage.removeItem('username');
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
  
      
        
        <div className="space-y-4">
          
          <Button onClick={handleSubmit}>Sign Out</Button>
        </div>
      
    </Dialog>
  );
}
