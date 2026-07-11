export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  userId: number;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
}
