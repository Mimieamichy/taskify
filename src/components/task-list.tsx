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
  if (tasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>Your task list is empty. Add a task above to get started!</p>
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
       <CardContent className="p-0">
          <div className="space-y-px"> {/* Use space-y-px for thin separators */}
              {tasks.map((task, index) => (
              <div key={task.id}>
                  <TaskItem
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                  />
                  {index < tasks.length - 1 && <hr className="border-border" />} {/* Separator line */}
              </div>
              ))}
          </div>
       </CardContent>
    </Card>
  );
}
