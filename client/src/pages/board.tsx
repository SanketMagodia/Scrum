import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getTasks, updateTask } from "@/lib/mongodb";
import { Task } from "@shared/schema";
import TaskCard from "@/components/task-card";
import CreateTaskDialog from "@/components/create-task-dialog";
import CreateUserDialog from "@/components/create-user-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourcesTab } from "@/pages/resource";
export default function Board() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const projectId = window.location.pathname.split("/")[2];

  useEffect(() => {
    if (!projectId) {
      setLocation("/");
      return;
    }

    const loadTasks = async () => {
      try {
        const fetchedTasks = await getTasks(projectId);
        setTasks(fetchedTasks);
      } catch (error) {
        toast({ title: "Failed to load tasks", variant: "destructive" });
      }
      setLoading(false);
    };

    loadTasks();
  }, [projectId]);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
  
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;
  
    // Optimistically update the UI
    const updatedTasks = tasks.map(task => 
      task._id === draggableId 
        ? { ...task, status: destination.droppableId } 
        : task
    );
    setTasks(updatedTasks);
  
    // Update the database in the background
    try {
      await updateTask(draggableId, { status: destination.droppableId });
    } catch (error) {
      // If the update fails, revert the UI change
      toast({ title: "Failed to update task status", variant: "destructive" });
      setTasks(tasks);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const columns = [
    { id: "pending", title: "Pending" },
    { id: "ongoing", title: "Ongoing" },
    { id: "completed", title: "Completed" }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Project: {projectId}</h1>
          <div className="flex gap-4">
            <CreateUserDialog projectId={projectId} />
            <CreateTaskDialog 
              projectId={projectId} 
              onTaskCreated={(task) => setTasks([...tasks, task])}
            />
          </div>
        </div>

        <Tabs defaultValue="board">
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          <TabsContent value="board">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {columns.map(({ id, title }) => (
                  <div key={id} className="bg-card rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">{title}</h2>
                    <Droppable droppableId={id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-4"
                        >
                          {tasks
                            .filter((task) => task.status === id)
                            .map((task, index) => (
                              <Draggable
                                key={task._id}
                                draggableId={task._id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TaskCard
                                      task={task}
                                      onDelete={(taskId) => {
                                        setTasks(tasks.filter(t => t._id !== taskId));
                                      }}
                                      onUpdate={(updatedTask) => {
                                        setTasks(tasks.map(t => 
                                          t._id === updatedTask._id ? updatedTask : t
                                        ));
                                      }}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </TabsContent>
          <TabsContent value="resources">
            <ResourcesTab projectId={projectId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}