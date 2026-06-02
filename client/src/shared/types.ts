export interface IUser {
  _id: string;
  email: string;
  name: string;
  theme: 'light' | 'dark';
  createdAt: string;
  updatedAt: string;
}

export interface IProject {
  _id: string;
  name: string;
  description: string;
  owner: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  project: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  content: string;
  task: string;
  author: { _id: string; name: string };
  createdAt: string;
}
