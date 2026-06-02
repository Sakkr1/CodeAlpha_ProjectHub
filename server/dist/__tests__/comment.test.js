import { describe, it, expect } from 'vitest';
import { z } from 'zod';
const createSchema = z.object({ content: z.string().min(1).max(5000) });
describe('Comment validation', () => {
    it('rejects empty content', () => {
        const result = createSchema.safeParse({ content: '' });
        expect(result.success).toBe(false);
    });
    it('rejects too long content', () => {
        const result = createSchema.safeParse({ content: 'a'.repeat(5001) });
        expect(result.success).toBe(false);
    });
    it('accepts valid content', () => {
        const result = createSchema.safeParse({ content: 'Nice work!' });
        expect(result.success).toBe(true);
    });
});
//# sourceMappingURL=comment.test.js.map