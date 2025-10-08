import type { Service } from '@/shared/types';
import type { HealthRepository } from './repository';
import type { NotificationService } from '../notifications/service';

export class HealthChecker {
  constructor(
    private healthRepository: HealthRepository,
    private notificationService: NotificationService
  ) {}

  async checkService(service: Service, baseUrl: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(service.url, {
        method: service.method,
        signal: AbortSignal.timeout(service.timeout),
      });

      const responseTime = Date.now() - startTime;
      const isHealthy = response.status === service.expectedStatus;

      await this.healthRepository.createHealthCheck(
        service.id,
        isHealthy ? 'healthy' : 'unhealthy',
        responseTime,
        response.status
      );

      if (!isHealthy) {
        console.log(`[ALERT] ${service.name} - Status: ${response.status}`);
        await this.notificationService.sendAlert(service, {
          responseTime,
          statusCode: response.status,
          error: `Expected ${service.expectedStatus}, got ${response.status}`,
        }, baseUrl);
      } else {
        console.log(`[OK] ${service.name} - ${responseTime}ms`);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await this.healthRepository.createHealthCheck(
        service.id,
        'unhealthy',
        responseTime,
        undefined,
        errorMessage
      );

      console.log(`[ALERT] ${service.name} - ${errorMessage}`);
      await this.notificationService.sendAlert(service, {
        responseTime,
        statusCode: 0,
        error: errorMessage,
      }, baseUrl);
    }
  }
}
