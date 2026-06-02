import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import projectRoutes from './modules/project/project.routes.js';
import taskRoutes from './modules/task/task.routes.js';
import commentRoutes from './modules/comment/comment.routes.js';
import { errorHandler } from './middleware/error.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:pid/tasks', taskRoutes);
app.use('/api/tasks/:tid/comments', commentRoutes);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map