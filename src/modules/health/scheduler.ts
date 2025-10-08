import { createDatabase } from '@/shared/database';
import { MonitoringRepository } from '../monitoring/repository';
import { NotificationRepository } from '../notifications/repository';
import { HealthRepository } from './repository';
import { HealthChecker } from './checker';
import { NotificationService } from "../notifications/service"
import type { Env } from '@/shared/types';

export class HealthScheduler {
  constructor(private env: Env) {}

  async run(): Promise<void> {
    console.log('[CRON] Running at:', new Date().toISOString());

    const db = createDatabase(this.env.DB);
    const monitoringRepo = new MonitoringRepository(db);
    const healthRepo = new HealthRepository(db);
    const notificationRepo = new NotificationRepository(db);

    const notificationService = new NotificationService(notificationRepo);
    const healthChecker = new HealthChecker(healthRepo, notificationService);

    const services = await monitoringRepo.getAllServices();
    console.log(`[CRON] Checking ${services.length} services...`);

    await Promise.all(
      services.map(service =>
        healthChecker.checkService(service, this.env.BASE_URL || '')
      )
    );
  }
}
