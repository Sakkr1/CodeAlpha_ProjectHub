import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
export declare function listByProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=task.controller.d.ts.map