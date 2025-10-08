import { Elysia } from 'elysia';
import { createDatabase } from '@/shared/database';
import { MonitoringRepository } from './repository';
import { MonitoringService } from './service';
import { HealthRepository } from '../health/repository';
import { ResponseHelper } from '@/shared/response';

export const monitoringRoutes = new Elysia({ prefix: '/api' })
  .derive(({ store }) => {
    const db = createDatabase((store as any).DB);
    const repository = new MonitoringRepository(db);
    const service = new MonitoringService(repository);
    const healthRepository = new HealthRepository(db);
    return { monitoringService: service, healthRepository };
  })

  .post('/services', async ({ body, monitoringService }) => {
    try {
      const result = await monitoringService.createService(body as any);
      return { success: true, service: result };
    } catch (error) {
      console.error('[Monitoring] Create error:', error);
      return ResponseHelper.error(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  })

  .get('/services', async ({ monitoringService, healthRepository }) => {
    const services = await monitoringService.getAllServices();

    const servicesWithUptime = await Promise.all(
      services.map(async (s) => {
        const uptime = await healthRepository.calculateUptime(s.id);
        return { ...s, uptime };
      })
    );

    return servicesWithUptime;
  })


  .get('/services/:id', async ({ params, monitoringService }) => {
    try {
      const service = await monitoringService.getServiceById(params.id);
      if (!service) {
        return ResponseHelper.error('Service not found', 404);
      }
      return service;
    } catch (error) {
      console.error('[Monitoring] Get by ID error:', error);
      return ResponseHelper.error(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  })

  .get('/services/:id/checks', async ({ params, healthRepository }) => {
    try {
      return await healthRepository.getHealthChecks(params.id);
    } catch (error) {
      console.error('[Monitoring] Get checks error:', error);
      return ResponseHelper.error(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  })

  .put('/services/:id', async ({ params, body, monitoringService }) => {
    try {
      await monitoringService.updateService(params.id, body as any);
      return { success: true };
    } catch (error) {
      console.error('[Monitoring] Update error:', error);
      return ResponseHelper.error(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  })

  .delete('/services/:id', async ({ params, monitoringService }) => {
    try {
      await monitoringService.deleteService(params.id);
      return { success: true };
    } catch (error) {
      console.error('[Monitoring] Delete error:', error);
      return ResponseHelper.error(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  });
