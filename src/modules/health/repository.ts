import { eq, desc } from 'drizzle-orm';
import type { Database } from '@/shared/database';
import { healthChecks } from '@/shared/database/schema';
import type { HealthCheck } from '@/shared/types';
import { CONFIG } from '@/shared/config';

export class HealthRepository {
  constructor(private db: Database) {}

  async createHealthCheck(
    serviceId: string,
    status: 'healthy' | 'unhealthy',
    responseTime: number,
    statusCode?: number,
    error?: string
  ): Promise<HealthCheck> {
    const check = {
      id: crypto.randomUUID(),
      serviceId,
      status,
      responseTime,
      statusCode: statusCode ?? null,
      error: error ?? null,
      timestamp: new Date(),
    };

    await this.db.insert(healthChecks).values(check);
    
    // Return with undefined instead of null for consistency
    return {
      ...check,
      statusCode: statusCode ?? undefined,
      error: error ?? undefined,
    } as HealthCheck;
  }

  async getHealthChecks(
    serviceId: string,
    limit: number = CONFIG.HEALTH_CHECK_LIMIT
  ): Promise<HealthCheck[]> {
    const results = await this.db
      .select()
      .from(healthChecks)
      .where(eq(healthChecks.serviceId, serviceId))
      .orderBy(desc(healthChecks.timestamp))
      .limit(limit)
      .all();

    // Map null to undefined
    return results.map(check => ({
      ...check,
      statusCode: check.statusCode ?? undefined,
      error: check.error ?? undefined,
    })) as HealthCheck[];
  }

  async calculateUptime(serviceId: string): Promise<number> {
    const checks = await this.db
      .select()
      .from(healthChecks)
      .where(eq(healthChecks.serviceId, serviceId))
      .orderBy(desc(healthChecks.timestamp))
      .limit(CONFIG.UPTIME_CALCULATION_LIMIT)
      .all();

    if (checks.length === 0) return 100;

    const healthyCount = checks.filter(c => c.status === 'healthy').length;
    return (healthyCount / checks.length) * 100;
  }
}
