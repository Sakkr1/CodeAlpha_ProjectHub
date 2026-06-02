import { create } from 'zustand';
import type { ITask } from '../../shared/types';

interface TasksState {
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
  addTask: (task: ITask) => void;
  updateTask: (id: string, data: Partial<ITask>) => void;
  removeTask: (id: string) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  updateTask: (id, data) => set((s) => ({ tasks: s.tasks.map((t) => (t._id === id ? { ...t, ...data } : t)) })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t._id !== id) })),
}));
