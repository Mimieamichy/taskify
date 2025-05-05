export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date; // Optional: Store the full date and time
  points?: number; // Optional: Store bonus points awarded
}
