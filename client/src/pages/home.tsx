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
    setLocation(`/board/${localStorage.getItem('username')}`);
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 text-white border border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">Scrum Board</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectId" className="text-gray-300">Project ID</Label>
            <Input
              id="projectId"
              className="bg-gray-800 text-white border border-gray-700 placeholder-gray-400"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Enter project ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              className="bg-gray-800 text-white border border-gray-700 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <Button 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleCreate}
              disabled={loading}
            >
              Create Project
            </Button>
            <Button 
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
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
