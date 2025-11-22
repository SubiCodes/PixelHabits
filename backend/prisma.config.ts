// prisma.config.ts (project root)
import 'dotenv/config'; // <- important: loads .env into process.env
import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  engine: 'classic',
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
});