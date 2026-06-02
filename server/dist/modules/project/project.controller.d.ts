import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
export declare function listAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getByIdPublic(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=project.controller.d.ts.map