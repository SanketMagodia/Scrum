import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Project, Resource } from "@shared/schema";
import axios from 'axios';

interface ResourcesTabProps {
  projectId: string;
}

export function ResourcesTab({ projectId }: ResourcesTabProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [newResource, setNewResource] = useState({ name: '', value: '' });
  const { toast } = useToast();

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await axios.get(`https://scrumbackend.onrender.com/api/project/${projectId}`);
      setProject(response.data);
    } catch (error) {
      toast({ title: "Failed to load project", variant: "destructive" });
    }
  };

  const updateProject = async (updates: Partial<Project>) => {
    try {
      await axios.patch(`https://scrumbackend.onrender.com/api/project/${projectId}`, updates);
      await loadProject(); // Reload the project to get the latest data
    } catch (error) {
      throw error;
    }
  };

  const handleAddResource = async () => {
    if (!project) return;
    try {
      const updatedResources = [...(project.resources || []), { ...newResource, _id: Date.now().toString() }];
      await updateProject({ resources: updatedResources });
      setNewResource({ name: '', value: '' });
      toast({ title: "Resource added successfully" });
    } catch (error) {
      toast({ title: "Failed to add resource", variant: "destructive" });
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!project) return;
    try {
      const updatedResources = project.resources?.filter(r => r.name !== id) || [];
      await updateProject({ resources: updatedResources });
      toast({ title: "Resource deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete resource", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied to clipboard!" });
    }).catch(() => {
      toast({ title: "Failed to copy", variant: "destructive" });
    });
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Project Resources</h2>
      <div className="flex flex-wrap gap-2">
        {project.resources?.map(resource => (
          <div
            key={resource._id}
            className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200"
            onClick={() => copyToClipboard(resource.value)}
          >
            <span className="font-medium">{resource.name}</span>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent bubble click from triggering
                handleDeleteResource(resource.name);
              }}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-end space-x-2">
        <div>
          <Label htmlFor="new-resource-name">Name</Label>
          <Input 
            id="new-resource-name"
            value={newResource.name} 
            onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="new-resource-value">Value</Label>
          <Input 
            id="new-resource-value"
            type="password"
            value={newResource.value} 
            onChange={(e) => setNewResource({ ...newResource, value: e.target.value })}
          />
        </div>
        <Button onClick={handleAddResource}>Add Resource</Button>
      </div>
    </div>
  );
}