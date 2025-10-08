import { createApp } from './app';
import { HealthScheduler } from '@/modules/health';
import type { Env } from '@/shared/types';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return createApp(env).handle(request);
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const scheduler = new HealthScheduler(env);
    ctx.waitUntil(scheduler.run());
  },
};
