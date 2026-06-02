import { Task } from './task.model.js';
import { Comment } from '../comment/comment.model.js';
import { NotFoundError } from '../../shared/errors.js';
function toJSON(task) {
    return { _id: task._id.toString(), title: task.title, description: task.description, status: task.status, project: task.project.toString(), createdBy: task.createdBy.toString(), createdAt: task.createdAt, updatedAt: task.updatedAt };
}
export async function listByProject(projectId) {
    const tasks = await Task.find({ project: projectId }).sort({ createdAt: -1 });
    return tasks.map(toJSON);
}
export async function create(title, description, projectId, userId) {
    const task = await Task.create({ title, description, project: projectId, createdBy: userId });
    return toJSON(task);
}
export async function update(taskId, data) {
    const task = await Task.findByIdAndUpdate(taskId, { $set: data }, { new: true, runValidators: true });
    if (!task)
        throw new NotFoundError('Task');
    return toJSON(task);
}
export async function remove(taskId) {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task)
        throw new NotFoundError('Task');
    await Comment.deleteMany({ task: taskId });
}
//# sourceMappingURL=task.service.js.map