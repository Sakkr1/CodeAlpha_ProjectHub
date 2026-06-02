import { Project } from './project.model.js';
import { Task } from '../task/task.model.js';
import { Comment } from '../comment/comment.model.js';
import { NotFoundError } from '../../shared/errors.js';
function toJSON(project) {
    return { _id: project._id.toString(), name: project.name, description: project.description, owner: project.owner.toString(), createdAt: project.createdAt, updatedAt: project.updatedAt };
}
export async function listAll() {
    const projects = await Project.find().populate('owner', 'name').sort({ createdAt: -1 });
    return projects.map((p) => ({
        ...toJSON(p),
        ownerName: p.owner?.name || 'Unknown',
    }));
}
export async function getByIdPublic(projectId) {
    const project = await Project.findById(projectId).populate('owner', 'name');
    if (!project)
        throw new NotFoundError('Project');
    return { ...toJSON(project), ownerName: project.owner?.name || 'Unknown' };
}
export async function list(userId) {
    const projects = await Project.find({ owner: userId }).sort({ createdAt: -1 });
    return projects.map(toJSON);
}
export async function getById(projectId, userId) {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project)
        throw new NotFoundError('Project');
    return toJSON(project);
}
export async function create(name, description, userId) {
    const project = await Project.create({ name, description, owner: userId });
    return toJSON(project);
}
export async function update(projectId, userId, data) {
    const project = await Project.findOneAndUpdate({ _id: projectId, owner: userId }, { $set: data }, { new: true, runValidators: true });
    if (!project)
        throw new NotFoundError('Project');
    return toJSON(project);
}
export async function remove(projectId, userId) {
    const project = await Project.findOneAndDelete({ _id: projectId, owner: userId });
    if (!project)
        throw new NotFoundError('Project');
    const tasks = await Task.find({ project: projectId });
    const taskIds = tasks.map((t) => t._id);
    await Comment.deleteMany({ task: { $in: taskIds } });
    await Task.deleteMany({ project: projectId });
}
//# sourceMappingURL=project.service.js.map