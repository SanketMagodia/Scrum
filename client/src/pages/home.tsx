import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createProject, joinProject } from "@/lib/mongodb";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [projectId, setProjectId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!projectId || !password) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      await createProject(projectId, password);
      localStorage.setItem('username', projectId);
      setLocation(`/board/${projectId}`);
    } catch (error) {
      toast({ title: "Failed to create project", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!projectId || !password) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const project = await joinProject(projectId, password);
      if (project) {
        localStorage.setItem('username', projectId);
        setLocation(`/board/${projectId}`);
      } else {
        toast({ title: "Invalid project ID or password", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to join project", variant: "destructive" });
    }
    setLoading(false);
  };
  if (localStorage.getItem('username')) {
    setLocation(`/board/${projectId}`);
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Scrum Board</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectId">Project ID</Label>
            <Input
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Enter project ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <Button 
              className="flex-1" 
              onClick={handleCreate}
              disabled={loading}
            >
              Create Project
            </Button>
            <Button 
              className="flex-1"
              variant="secondary"
              onClick={handleJoin}
              disabled={loading}
            >
              Join Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
