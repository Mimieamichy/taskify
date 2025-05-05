"use client";

import type { Task } from "@/types/task";
import { TaskItem } from "./task-item";
import { Card, CardContent } from "@/components/ui/card";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onDelete }: TaskListProps) {
  // The empty state message is now handled in page.tsx
  // if (tasks.length === 0) {
  //   return null; // Or potentially a different placeholder if needed within the list context
  // }

  return (
    <Card className="shadow-sm border border-border"> {/* Use subtle border and shadow */}
       <CardContent className="p-0"> {/* Remove padding from CardContent */}
          <div className="space-y-px bg-border"> {/* Use border color for separators */}
              {tasks.map((task) => (
                <div key={task.id} className="bg-card"> {/* Ensure items have card background */}
                    <TaskItem
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                    />
                </div>
              ))}
          </div>
       </CardContent>
    </Card>
  );
}
