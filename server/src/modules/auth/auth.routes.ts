import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { User } from './auth.model.js';
import { NotFoundError } from '../../shared/errors.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new NotFoundError('User');
    res.json({ _id: user._id.toString(), email: user.email, name: user.name, theme: user.theme, createdAt: user.createdAt, updatedAt: user.updatedAt });
  } catch (err) { next(err); }
});
router.patch('/theme', authenticate, authController.updateTheme);

export default router;
