import { Task } from './task.model.js';
import { Comment } from '../comment/comment.model.js';
import { NotFoundError } from '../../shared/errors.js';
import type { TaskStatus } from './task.model.js';

function toJSON(task: any) {
  return { _id: task._id.toString(), title: task.title, description: task.description, status: task.status, project: task.project.toString(), createdBy: task.createdBy.toString(), createdAt: task.createdAt, updatedAt: task.updatedAt };
}

export async function listByProject(projectId: string) {
  const tasks = await Task.find({ project: projectId }).sort({ createdAt: -1 });
  return tasks.map(toJSON);
}

export async function create(title: string, description: string, projectId: string, userId: string) {
  const task = await Task.create({ title, description, project: projectId, createdBy: userId });
  return toJSON(task);
}

export async function update(taskId: string, data: { title?: string; description?: string; status?: TaskStatus }) {
  const task = await Task.findByIdAndUpdate(taskId, { $set: data }, { new: true, runValidators: true });
  if (!task) throw new NotFoundError('Task');
  return toJSON(task);
}

export async function remove(taskId: string) {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) throw new NotFoundError('Task');
  await Comment.deleteMany({ task: taskId });
}
