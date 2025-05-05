"use client";

import { useState, useEffect } from 'react';
import type { Task } from "@/types/task";
import useLocalStorage from "@/hooks/use-local-storage";
import { AddTaskForm } from "@/components/add-task-form";
import { TaskList } from "@/components/task-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from 'lucide-react'; // Using CheckSquare for a todo list icon

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  // Hydration safety: Ensure tasks are only rendered client-side after loading from localStorage
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(), // Use crypto.randomUUID for generating unique IDs
      text,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Filter tasks into incomplete and completed
  const incompleteTasks = isClient ? tasks.filter(task => !task.completed) : [];
  const completedTasks = isClient ? tasks.filter(task => task.completed) : [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
      <Card className="w-full max-w-2xl shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-6 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckSquare className="h-8 w-8" />
            <CardTitle className="text-2xl font-bold">TaskTango</CardTitle>
          </div>
          {/* Placeholder for potential future elements like settings or user info */}
        </CardHeader>
        <CardContent className="p-6">
          <AddTaskForm onAddTask={addTask} />

          <div className="space-y-6">
            {/* Incomplete Tasks Section */}
            {incompleteTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-foreground">To Do</h2>
                <TaskList
                  tasks={incompleteTasks}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTask}
                />
              </div>
            )}

             {/* Separator only if both lists have items */}
             {incompleteTasks.length > 0 && completedTasks.length > 0 && (
                <hr className="border-border my-6" />
             )}

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Completed</h2>
                <TaskList
                  tasks={completedTasks}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTask}
                />
              </div>
            )}

            {/* Show message only if both lists are empty and client has loaded */}
             {isClient && tasks.length === 0 && (
                 <div className="text-center text-muted-foreground py-10">
                    <p>Your task list is empty. Add a task above to get started!</p>
                </div>
             )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
