export interface IUser {
  _id: string;
  email: string;
  name: string;
  theme: 'light' | 'dark';
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  _id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  project: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  content: string;
  task: string;
  author: { _id: string; name: string };
  createdAt: Date;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}
