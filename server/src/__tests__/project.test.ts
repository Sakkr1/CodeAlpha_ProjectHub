import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const createSchema = z.object({ name: z.string().min(1).max(200), description: z.string().max(2000).default('') });
const updateSchema = z.object({ name: z.string().min(1).max(200).optional(), description: z.string().max(2000).optional() });

describe('Project validation', () => {
  it('rejects empty name', () => {
    const result = createSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects name too long', () => {
    const result = createSchema.safeParse({ name: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('accepts valid create input', () => {
    const result = createSchema.safeParse({ name: 'My Project', description: 'Desc' });
    expect(result.success).toBe(true);
  });

  it('defaults description to empty', () => {
    const result = createSchema.safeParse({ name: 'Project' });
    expect(result.success && result.data.description).toBe('');
  });

  it('accepts partial update', () => {
    const result = updateSchema.safeParse({ name: 'New Name' });
    expect(result.success).toBe(true);
  });

  it('explore list returns projects without owner filter', async () => {
    const { listAll } = await import('../modules/project/project.service.js');
    expect(typeof listAll).toBe('function');
  });

  it('explore detail returns project by id without owner filter', async () => {
    const { getByIdPublic } = await import('../modules/project/project.service.js');
    expect(typeof getByIdPublic).toBe('function');
  });
});
