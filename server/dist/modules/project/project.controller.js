import { z } from 'zod';
import * as projectService from './project.service.js';
const createSchema = z.object({ name: z.string().min(1).max(200), description: z.string().max(2000).default('') });
const updateSchema = z.object({ name: z.string().min(1).max(200).optional(), description: z.string().max(2000).optional() });
function param(req, name) {
    const val = req.params[name];
    return Array.isArray(val) ? val[0] : val;
}
export async function listAll(req, res, next) {
    try {
        const projects = await projectService.listAll();
        res.json(projects);
    }
    catch (err) {
        next(err);
    }
}
export async function getByIdPublic(req, res, next) {
    try {
        const project = await projectService.getByIdPublic(param(req, 'id'));
        res.json(project);
    }
    catch (err) {
        next(err);
    }
}
export async function list(req, res, next) {
    try {
        const projects = await projectService.list(req.userId);
        res.json(projects);
    }
    catch (err) {
        next(err);
    }
}
export async function getById(req, res, next) {
    try {
        const project = await projectService.getById(param(req, 'id'), req.userId);
        res.json(project);
    }
    catch (err) {
        next(err);
    }
}
export async function create(req, res, next) {
    try {
        const data = createSchema.parse(req.body);
        const project = await projectService.create(data.name, data.description, req.userId);
        res.status(201).json(project);
    }
    catch (err) {
        next(err);
    }
}
export async function update(req, res, next) {
    try {
        const data = updateSchema.parse(req.body);
        const project = await projectService.update(param(req, 'id'), req.userId, data);
        res.json(project);
    }
    catch (err) {
        next(err);
    }
}
export async function remove(req, res, next) {
    try {
        await projectService.remove(param(req, 'id'), req.userId);
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=project.controller.js.map