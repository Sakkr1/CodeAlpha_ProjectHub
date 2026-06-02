import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../shared/errors.js';
export function authenticate(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
        throw new UnauthorizedError('No token provided');
    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch {
        throw new UnauthorizedError('Invalid token');
    }
}
//# sourceMappingURL=auth.js.map