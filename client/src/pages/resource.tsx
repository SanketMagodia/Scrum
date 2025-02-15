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
      const response = await axios.get(`/api/project/${projectId}`);
      setProject(response.data);
    } catch (error) {
      toast({ title: "Failed to load project", variant: "destructive" });
    }
  };

  const updateProject = async (updates: Partial<Project>) => {
    try {
      await axios.patch(`/api/project/${projectId}`, updates);
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

  const handleUpdateResource = async (id: string, updatedResource: Partial<Resource>) => {
    if (!project) return;
    try {
      const updatedResources = project.resources?.map(r => r._id === id ? { ...r, ...updatedResource } : r) || [];
      await updateProject({ resources: updatedResources });
      toast({ title: "Resource updated successfully" });
    } catch (error) {
      toast({ title: "Failed to update resource", variant: "destructive" });
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!project) return;
    try {
      const updatedResources = project.resources?.filter(r => r._id !== id) || [];
      await updateProject({ resources: updatedResources });
      toast({ title: "Resource deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete resource", variant: "destructive" });
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Project Resources</h2>
      {project.resources?.map(resource => (
        <div key={resource._id} className="flex items-center space-x-2">
          <Input 
            value={resource.name} 
            onChange={(e) => handleUpdateResource(resource._id, { name: e.target.value })}
          />
          <Input 
            type="password"
            value={resource.value} 
            onChange={(e) => handleUpdateResource(resource._id, { value: e.target.value })}
          />
          <Button onClick={() => handleDeleteResource(resource._id)} variant="destructive">Delete</Button>
        </div>
      ))}
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
