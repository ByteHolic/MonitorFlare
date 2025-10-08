import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { monitoringRoutes } from '@/modules/monitoring';
import { notificationRoutes } from '@/modules/notifications';
import { authRoutes } from '@/modules/auth';
import { uiRoutes } from '@/modules/ui';
import type { Env } from '@/shared/types';

export const createApp = (env: Env) =>
  new Elysia({ aot: false, name: 'monitorflare' })
    .state('DB', env.DB)
    .state('BASE_URL', env.BASE_URL || '')
    .state('ADMIN_USERNAME', env.ADMIN_USERNAME || 'admin')
    .state('ADMIN_PASSWORD', env.ADMIN_PASSWORD || 'admin123')
    .use(cors({ credentials: true, origin: true }))
    .use(authRoutes)
    .use(monitoringRoutes)
    .use(notificationRoutes)
    .use(uiRoutes);
