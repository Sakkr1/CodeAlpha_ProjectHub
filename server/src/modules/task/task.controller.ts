import { Response, NextFunction } from 'express';
import { z } from 'zod';
import * as taskService from './task.service.js';
import { AuthRequest } from '../../middleware/auth.js';

const createSchema = z.object({ title: z.string().min(1).max(300), description: z.string().max(5000).default('') });
const updateSchema = z.object({ title: z.string().min(1).max(300).optional(), description: z.string().max(5000).optional(), status: z.enum(['todo', 'in_progress', 'done']).optional() });

function param(req: AuthRequest, name: string): string {
  const val = req.params[name];
  return Array.isArray(val) ? val[0] : val;
}

export async function listByProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const tasks = await taskService.listByProject(param(req, 'pid'));
    res.json(tasks);
  } catch (err) { next(err); }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const task = await taskService.create(data.title, data.description, param(req, 'pid'), req.userId!);
    res.status(201).json(task);
  } catch (err) { next(err); }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const task = await taskService.update(param(req, 'id'), data);
    res.json(task);
  } catch (err) { next(err); }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await taskService.remove(param(req, 'id'));
    res.status(204).end();
  } catch (err) { next(err); }
}
