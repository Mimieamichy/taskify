"use client";

import type { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Trash2, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from 'date-fns'; // Import date-fns for formatting

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3 flex-grow min-w-0"> {/* Ensure label can wrap */}
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
          className={cn(
            "flex-shrink-0 h-5 w-5 rounded", // Prevent checkbox shrinking
            task.completed ? "border-accent data-[state=checked]:bg-accent data-[state=checked]:border-accent" : "border-primary"
          )}
        />
        <div className="flex flex-col flex-grow min-w-0"> {/* Allow vertical stacking and wrapping */}
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              "text-base cursor-pointer transition-colors duration-200 break-words", // Allow long words to break
              task.completed ? "text-muted-foreground line-through" : "text-foreground"
            )}
          >
            {task.text}
          </label>
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>{format(task.dueDate, 'PPp')}</span> {/* Format date and time */}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0 ml-2"> {/* Prevent controls shrinking */}
        {task.points && task.points > 0 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Star className="h-3 w-3 mr-1 text-yellow-500" /> +{task.points}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          className="text-muted-foreground hover:text-destructive h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
