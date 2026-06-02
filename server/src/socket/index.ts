import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { logger } from '../shared/logger.js';
import * as commentService from '../modules/comment/comment.service.js';

let io: Server;

export function initSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, { cors: { origin: '*' } });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      (socket as any).userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('join-task', (taskId: string) => {
      socket.join(`task:${taskId}`);
    });

    socket.on('leave-task', (taskId: string) => {
      socket.leave(`task:${taskId}`);
    });

    socket.on('comment:new', async (data: { taskId: string; content: string }) => {
      try {
        const comment = await commentService.create(data.content, data.taskId, (socket as any).userId);
        io.to(`task:${data.taskId}`).emit('comment:created', comment);
      } catch (error) {
        socket.emit('error', { message: 'Failed to create comment' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}
