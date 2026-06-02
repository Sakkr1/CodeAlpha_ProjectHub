import { Response, NextFunction } from 'express';
import { z } from 'zod';
import * as commentService from './comment.service.js';
import { AuthRequest } from '../../middleware/auth.js';

const createSchema = z.object({ content: z.string().min(1).max(5000) });

function param(req: AuthRequest, name: string): string {
  const val = req.params[name];
  return Array.isArray(val) ? val[0] : val;
}

export async function listByTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const comments = await commentService.listByTask(param(req, 'tid'));
    res.json(comments);
  } catch (err) { next(err); }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const comment = await commentService.create(data.content, param(req, 'tid'), req.userId!);
    res.status(201).json(comment);
  } catch (err) { next(err); }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await commentService.remove(param(req, 'id'), req.userId!);
    res.status(204).end();
  } catch (err) { next(err); }
}
