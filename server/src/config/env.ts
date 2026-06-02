import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/project-mgmt'),
  JWT_SECRET: z.string().min(8).default('dev-secret-change-in-production'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  process.stderr.write('Invalid environment variables: ' + JSON.stringify(result.error.flatten()) + '\n');
  process.exit(1);
}

export const env = result.data;
