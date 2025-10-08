import type { Config } from 'drizzle-kit';

export default {
  schema: './src/shared/database/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
} satisfies Config;
