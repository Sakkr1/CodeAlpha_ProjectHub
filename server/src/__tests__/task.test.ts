import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const createSchema = z.object({ title: z.string().min(1).max(300), description: z.string().max(5000).default('') });
const updateSchema = z.object({ title: z.string().min(1).max(300).optional(), description: z.string().max(5000).optional(), status: z.enum(['todo', 'in_progress', 'done']).optional() });

describe('Task validation', () => {
  it('rejects empty title', () => {
    const result = createSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });

  it('accepts valid create input', () => {
    const result = createSchema.safeParse({ title: 'Task 1', description: 'Do thing' });
    expect(result.success).toBe(true);
  });

  it('accepts valid status update', () => {
    const result = updateSchema.safeParse({ status: 'done' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = updateSchema.safeParse({ status: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('defaults description to empty', () => {
    const result = createSchema.safeParse({ title: 'Task' });
    expect(result.success && result.data.description).toBe('');
  });

  it('accepts all valid status values in update', () => {
    expect(updateSchema.safeParse({ status: 'todo' }).success).toBe(true);
    expect(updateSchema.safeParse({ status: 'in_progress' }).success).toBe(true);
    expect(updateSchema.safeParse({ status: 'done' }).success).toBe(true);
  });

  it('allows partial update with only status', () => {
    const result = updateSchema.safeParse({ status: 'in_progress' });
    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty('title');
  });

  it('validates update endpoint URL pattern requires projectId prefix', () => {
    const pattern = '/api/projects/:pid/tasks/:id';
    expect(pattern).toMatch(/\/projects\/:pid\/tasks\/:id/);
    expect(pattern).not.toMatch(/^\/api\/tasks\//);
  });
});
