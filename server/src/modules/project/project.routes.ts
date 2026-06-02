import { Router } from 'express';
import * as projectController from './project.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', projectController.list);
router.post('/', projectController.create);
router.get('/explore', projectController.listAll);
router.get('/explore/:id', projectController.getByIdPublic);
router.get('/:id', projectController.getById);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.remove);

export default router;
