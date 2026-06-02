import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
export declare function listByTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=comment.controller.d.ts.map