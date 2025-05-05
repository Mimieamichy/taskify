"use client";

import type { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
          className={cn(
            "h-5 w-5 rounded",
            task.completed ? "border-accent data-[state=checked]:bg-accent data-[state=checked]:border-accent" : "border-primary"
          )}
        />
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            "text-base cursor-pointer transition-colors duration-200",
            task.completed ? "text-muted-foreground line-through" : "text-foreground"
          )}
        >
          {task.text}
        </label>
      </div>
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
  );
}
