"use client";

import { useState, useEffect } from 'react';
import type { Task } from "@/types/task";
import useLocalStorage from "@/hooks/use-local-storage";
import { AddTaskForm } from "@/components/add-task-form";
import { TaskList } from "@/components/task-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Star } from 'lucide-react';
import { differenceInMinutes, isSameDay, parse } from 'date-fns'; // Import date-fns functions

const BONUS_POINTS_ON_TIME = 1;
const ON_TIME_TOLERANCE_MINUTES = 15;

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  // Hydration safety: Ensure tasks are only rendered client-side after loading from localStorage
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addTask = (text: string, time?: string) => {
    let dueDate: Date | undefined = undefined;
    if (time) {
        try {
            // Combine current date with the selected time HH:mm
            const now = new Date();
            const [hours, minutes] = time.split(':').map(Number);
            // Check if hours and minutes are valid numbers
            if (!isNaN(hours) && !isNaN(minutes)) {
                dueDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
            } else {
                 console.warn("Invalid time format received:", time);
            }
        } catch (e) {
            console.error("Error parsing time:", e);
        }
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      dueDate, // Assign the parsed Date object or undefined
      points: 0, // Initialize points
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

 const toggleComplete = (id: string) => {
    const now = new Date(); // Get current time when toggling

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const wasCompleted = task.completed;
          const isNowCompleting = !wasCompleted;
          let pointsEarned = task.points || 0;

          // Award points only when marking as complete (not when un-marking)
          // and only if points haven't already been awarded for this task
          if (isNowCompleting && task.dueDate && (task.points === 0 || task.points === undefined)) {
            const diffMinutes = Math.abs(differenceInMinutes(now, task.dueDate));
            const sameDay = isSameDay(now, task.dueDate);

            console.log(`Task ${task.id} completion check:`);
            console.log(`  Now: ${now}`);
            console.log(`  Due: ${task.dueDate}`);
            console.log(`  Diff (mins): ${diffMinutes}`);
            console.log(`  Same Day: ${sameDay}`);


            if (sameDay && diffMinutes <= ON_TIME_TOLERANCE_MINUTES) {
              pointsEarned += BONUS_POINTS_ON_TIME;
               console.log(`  Awarding ${BONUS_POINTS_ON_TIME} points!`);
            } else {
                 console.log(`  Not within time tolerance.`);
            }
          } else if(isNowCompleting && !task.dueDate) {
             console.log(`Task ${task.id} has no due date.`);
          } else if (isNowCompleting && task.points && task.points > 0) {
              console.log(`Task ${task.id} already has points.`);
          }


          return { ...task, completed: !task.completed, points: pointsEarned };
        }
        return task;
      })
    );
  };


  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Filter tasks into incomplete and completed
  const incompleteTasks = isClient ? tasks.filter(task => !task.completed) : [];
  const completedTasks = isClient ? tasks.filter(task => task.completed) : [];

  // Calculate total points
  const totalPoints = isClient ? tasks.reduce((sum, task) => sum + (task.points || 0), 0) : 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
      <Card className="w-full max-w-2xl shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-6 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckSquare className="h-8 w-8" />
            <CardTitle className="text-2xl font-bold">TaskTango</CardTitle>
          </div>
           <div className="flex items-center space-x-2 bg-primary/80 px-3 py-1 rounded-full">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold text-lg">{totalPoints}</span>
              <span className="text-sm hidden sm:inline">Bonus Points</span>
          </div>
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
