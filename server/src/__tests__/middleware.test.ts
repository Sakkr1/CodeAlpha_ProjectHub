import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, UnauthorizedError } from '../shared/errors.js';

describe('AppError', () => {
  it('creates error with status and message', () => {
    const err = new AppError(400, 'Bad request');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Bad request');
  });

  it('NotFoundError has 404 status', () => {
    const err = new NotFoundError('Project');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Project not found');
  });

  it('UnauthorizedError has 401 status', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Unauthorized');
  });
});
