import { Router } from 'express';
import * as commentController from './comment.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(authenticate);

router.get('/', commentController.listByTask);
router.post('/', commentController.create);
router.delete('/:id', commentController.remove);

export default router;
