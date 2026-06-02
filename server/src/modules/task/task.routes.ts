import { Router } from 'express';
import * as taskController from './task.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(authenticate);

router.get('/', taskController.listByProject);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);

export default router;
