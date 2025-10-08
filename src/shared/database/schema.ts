import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  method: text('method').notNull().default('GET'),
  timeout: integer('timeout').notNull().default(10000),
  expectedStatus: integer('expected_status').notNull().default(200),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const healthChecks = sqliteTable('health_checks', {
  id: text('id').primaryKey(),
  serviceId: text('service_id')
    .notNull()
    .references(() => services.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['healthy', 'unhealthy'] }).notNull(),
  responseTime: integer('response_time').notNull(),
  statusCode: integer('status_code'),
  error: text('error'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['telegram', 'slack'] }).notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  config: text('config').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
