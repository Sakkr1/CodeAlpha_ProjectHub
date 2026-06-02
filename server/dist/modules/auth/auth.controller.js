import { z } from 'zod';
import * as authService from './auth.service.js';
const registerSchema = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().min(1).max(100) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const themeSchema = z.object({ theme: z.enum(['light', 'dark']) });
export async function register(req, res, next) {
    try {
        const data = registerSchema.parse(req.body);
        const result = await authService.register(data.email, data.password, data.name);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
}
export async function login(req, res, next) {
    try {
        const data = loginSchema.parse(req.body);
        const result = await authService.login(data.email, data.password);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
export async function updateTheme(req, res, next) {
    try {
        const data = themeSchema.parse(req.body);
        const user = await authService.updateTheme(req.userId, data.theme);
        res.json(user);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map