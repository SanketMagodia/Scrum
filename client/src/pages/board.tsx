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
  if (!localStorage.getItem('username')) {
    setLocation(`/`);
    }
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
  
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;
  
    // Optimistically update the UI
    const updatedTasks = tasks.map(task => 
      task.idd === draggableId 
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
    return <div>Server is waking up... refresh this window in 1 min</div>;
  }

  const columns = [
    { id: "pending", title: "Pending" },
    { id: "ongoing", title: "Ongoing" },
    { id: "completed", title: "Completed" }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{projectId}</h1>
          <div className="flex gap-4">
            <CreateUserDialog projectId={projectId} />
            <CreateTaskDialog 
              projectId={projectId} 
              onTaskCreated={(task) => setTasks([...tasks, task])}
            />
          </div>
        </div>

        {/* Color legend */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-blue-400 border border-blue-500"></span>
            <span className="text-sm text-white">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-400 border border-red-500"></span>
            <span className="text-sm text-white">Urgent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-green-400 border border-green-500"></span>
            <span className="text-sm text-white">Questions/Info</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-yellow-300 border border-yellow-400"></span>
            <span className="text-sm text-white">Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-purple-400 border border-purple-500"></span>
            <span className="text-sm text-white">Optional</span>
          </div>
        </div>
        {/* End color legend */}

        <Tabs defaultValue="board">
          <TabsList className="bg-gray-900 rounded-lg p-1 flex gap-2 mb-4">
            <TabsTrigger
              value="board"
              className="px-4 py-2 rounded text-gray-200 data-[state=active]:bg-blue-400 data-[state=active]:text-white transition"
            >
              Board
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="px-4 py-2 rounded text-gray-200 data-[state=active]:bg-purple-400 data-[state=active]:text-white transition"
            >
              Resources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="board">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {columns.map(({ id, title }) => (
                  <div key={id} className="bg-black rounded-lg p-4">
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
                                key={task.idd}
                                draggableId={task.idd}
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
                                        setTasks(tasks.filter(t => t.idd !== taskId));
                                      }}
                                      onUpdate={(updatedTask) => {
                                        setTasks(tasks.map(t => 
                                          t.idd === updatedTask.idd ? updatedTask : t
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