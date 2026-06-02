import { create } from 'zustand';

interface Project {
  _id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),
  updateProject: (id, data) => set((s) => ({ projects: s.projects.map((p) => (p._id === id ? { ...p, ...data } : p)) })),
  removeProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p._id !== id) })),
}));
