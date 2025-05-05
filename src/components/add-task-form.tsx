"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddTaskFormProps {
  onAddTask: (text: string) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [taskText, setTaskText] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedText = taskText.trim();
    if (trimmedText) {
      onAddTask(trimmedText);
      setTaskText("");
    } else {
        toast({
            title: "Cannot add empty task",
            description: "Please enter some text for your task.",
            variant: "destructive",
        });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-grow text-base md:text-sm"
        aria-label="New task input"
      />
      <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" aria-label="Add new task">
        <Plus className="h-4 w-4 mr-1 md:mr-2" />
        Add Task
      </Button>
    </form>
  );
}
