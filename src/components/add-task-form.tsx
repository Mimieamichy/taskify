"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Import Label
import { Plus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddTaskFormProps {
  onAddTask: (text: string, time?: string) => void; // Accept optional time string (HH:MM)
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [taskText, setTaskText] = useState("");
  const [taskTime, setTaskTime] = useState(""); // State for time input
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedText = taskText.trim();
    if (trimmedText) {
      onAddTask(trimmedText, taskTime || undefined); // Pass time if set
      setTaskText("");
      setTaskTime(""); // Reset time input
    } else {
        toast({
            title: "Cannot add empty task",
            description: "Please enter some text for your task.",
            variant: "destructive",
        });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
      <Input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-grow text-base md:text-sm"
        aria-label="New task input"
      />
      <div className="flex gap-2 items-end">
        <div className="flex-grow">
          <Label htmlFor="task-time" className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Optional Time
          </Label>
          <Input
            id="task-time"
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            className="text-base md:text-sm"
            aria-label="Optional task time"
          />
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground self-end h-10" aria-label="Add new task">
          <Plus className="h-4 w-4 mr-1 md:mr-2" />
          Add Task
        </Button>
      </div>
    </form>
  );
}
