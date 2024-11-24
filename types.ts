export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  date: Date;
  priority: Priority;
  completed: boolean;
}