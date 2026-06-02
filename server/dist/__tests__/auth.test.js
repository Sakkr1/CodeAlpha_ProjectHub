import { describe, it, expect } from 'vitest';
import { z } from 'zod';
const registerSchema = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().min(1).max(100) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
describe('Auth validation', () => {
    it('rejects invalid email on register', () => {
        const result = registerSchema.safeParse({ email: 'bad', password: '123456', name: 'Test' });
        expect(result.success).toBe(false);
    });
    it('rejects short password on register', () => {
        const result = registerSchema.safeParse({ email: 'a@b.com', password: '123', name: 'Test' });
        expect(result.success).toBe(false);
    });
    it('accepts valid register input', () => {
        const result = registerSchema.safeParse({ email: 'a@b.com', password: '123456', name: 'Test' });
        expect(result.success).toBe(true);
    });
    it('rejects missing email on login', () => {
        const result = loginSchema.safeParse({ password: '123' });
        expect(result.success).toBe(false);
    });
    it('accepts valid login input', () => {
        const result = loginSchema.safeParse({ email: 'a@b.com', password: '123456' });
        expect(result.success).toBe(true);
    });
});
//# sourceMappingURL=auth.test.js.map