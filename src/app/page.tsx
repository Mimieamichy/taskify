
"use client";

import { useState, useEffect } from 'react';
import type { Task } from "@/types/task";
import useLocalStorage from "@/hooks/use-local-storage";
import { AddTaskForm } from "@/components/add-task-form";
import { TaskList } from "@/components/task-list";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Import CardFooter
import { CheckSquare, Star, Info, Trash2, AlertTriangle } from 'lucide-react'; // Import icons
import { differenceInMinutes, isSameDay } from 'date-fns'; // Import date-fns functions
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { ThemeToggle } from "@/components/theme-toggle"; // Import ThemeToggle
import { Button } from "@/components/ui/button"; // Import Button
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components

const BONUS_POINTS_ON_TIME = 1;
const ON_TIME_TOLERANCE_MINUTES = 15; // Allow 15 minutes buffer

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  // Hydration safety: Ensure components depending on localStorage are only rendered client-side
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast(); // Get toast function

  useEffect(() => {
    // This effect runs only on the client, after the initial render
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
                 // console.warn("Invalid time format received:", time); // Removed console.warn
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
          let awardedBonus = false; // Flag to check if bonus was awarded in this toggle

          // Award points only when marking as complete (not when un-marking)
          // and only if points haven't already been awarded for this task
          if (isNowCompleting && task.dueDate && !task.points) { // Check !task.points ensures points awarded only once
            // Calculate difference only if dueDate is valid
            const diffMinutes = differenceInMinutes(now, task.dueDate); // now - dueDate
            const sameDay = isSameDay(now, task.dueDate);

            // Check if completion is on the same day AND
            // EITHER before the due date OR within the tolerance window *after* the due date.
            // now <= dueDate + tolerance
             if (sameDay && now <= new Date(task.dueDate.getTime() + ON_TIME_TOLERANCE_MINUTES * 60000)) {
              pointsEarned += BONUS_POINTS_ON_TIME;
              awardedBonus = true; // Set flag
               // console.log(`Task ${task.id}: Awarding ${BONUS_POINTS_ON_TIME} points! Completed within tolerance.`); // Removed console.log
            } else {
                 // console.log(`Task ${task.id}: Not completed within time tolerance.`); // Removed console.log
            }
          } else if(isNowCompleting && !task.dueDate) {
             // console.log(`Task ${task.id} has no due date, cannot award points.`); // Removed console.log
          } else if (isNowCompleting && task.points && task.points > 0) {
              // console.log(`Task ${task.id} already has points.`); // Removed console.log
          } else if (!isNowCompleting) {
              // Optional: Decide if un-completing should remove points. Currently, it doesn't.
              // pointsEarned = 0; // Uncomment to remove points on un-completion
               // console.log(`Task ${task.id}: Marked as incomplete.`); // Removed console.log
          }

          // Show toast only if a bonus was just awarded
          if (awardedBonus) {
             toast({
                title: "Well Done!",
                description: `Task completed on time! +${BONUS_POINTS_ON_TIME} bonus point.`,
                variant: "default", // Use default variant (can be styled further)
             });
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

  const clearCompletedTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
    toast({
        title: "Completed Tasks Cleared",
        description: "All completed tasks have been removed.",
        variant: "default",
    });
  };

  // Filter tasks into incomplete and completed *only* on the client
  const incompleteTasks = isClient ? tasks.filter(task => !task.completed) : [];
  const completedTasks = isClient ? tasks.filter(task => task.completed) : [];

  // Calculate total points *only* on the client
  const totalPoints = isClient ? tasks.reduce((sum, task) => sum + (task.points || 0), 0) : 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
      <Card className="w-full max-w-2xl shadow-xl rounded-lg overflow-hidden flex flex-col"> {/* Added flex flex-col */}
        <CardHeader className="bg-primary text-primary-foreground p-6 flex flex-row items-start sm:items-center justify-between">
           <div className="flex flex-col flex-grow"> {/* Allow title/info to take space */}
            <div className="flex items-center space-x-3">
              <CheckSquare className="h-8 w-8" />
              <CardTitle className="text-2xl font-bold">Taskify</CardTitle>
            </div>
             <div className="flex items-center space-x-1 mt-1.5 text-xs text-primary-foreground/80 ml-11"> {/* Info message */}
                <Info className="h-3 w-3" />
                <span>Complete tasks on time for bonus points!</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0"> {/* Group points and theme toggle */}
             {isClient ? (
                <div className="flex items-center space-x-2 bg-primary/80 px-3 py-1 rounded-full flex-shrink-0 mt-1 sm:mt-0"> {/* Points display */}
                    <Star className="h-5 w-5 text-warning" /> {/* Updated color */}
                    <span className="font-semibold text-lg">{totalPoints}</span>
                    <span className="text-sm hidden sm:inline">Bonus Points</span>
                </div>
             ) : (
                <Skeleton className="h-8 w-24 rounded-full mt-1 sm:mt-0" /> // Skeleton for points
             )}
            <ThemeToggle /> {/* Add the ThemeToggle component */}
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow"> {/* Added flex-grow */}
          <AddTaskForm onAddTask={addTask} />

          <div className="space-y-6">
            {/* Render Loading Skeletons or Task Lists */}
            {!isClient ? (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold mb-3 text-foreground">To Do</h2>
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                </div>
            ) : (
                <>
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
                    {tasks.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                            <p>Your task list is empty. Add a task above to get started!</p>
                        </div>
                    )}
                </>
            )}
          </div>
        </CardContent>

        {/* Clear Completed Button with Confirmation - Render only on client and if needed */}
        {isClient && completedTasks.length > 0 && (
           <CardFooter className="p-6 border-t border-border justify-end"> {/* Moved button to CardFooter */}
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50">
                   <Trash2 className="h-4 w-4 mr-1" />
                   Clear Completed ({completedTasks.length})
                 </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle className="flex items-center">
                     <AlertTriangle className="h-5 w-5 mr-2 text-destructive" /> Are you sure?
                   </AlertDialogTitle>
                   <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete all your completed tasks ({completedTasks.length} total). Incomplete tasks will remain.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                   <AlertDialogAction
                      onClick={clearCompletedTasks} // Use the new function
                      className={
                        'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      }
                    >
                     Yes, clear completed tasks
                   </AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           </CardFooter>
        )}
      </Card>
      <footer className="mt-8 text-sm text-muted-foreground">
        <p>Made with ❤️ by Mae Techs</p>
        <p>© {new Date().getFullYear()} Taskify</p>
      </footer>
    </main>
  );
}
