import { Elysia } from 'elysia';
import { createDatabase } from '@/shared/database';
import { NotificationRepository } from './repository';
import { NotificationService } from './service';
import { ResponseHelper } from '@/shared/response';
import { TelegramProvider } from './providers/telegram';
import { SlackProvider } from './providers/slack';

export const notificationRoutes = new Elysia({ prefix: '/api' })
  .derive(({ store }) => {
    const db = createDatabase((store as any).DB);
    const repository = new NotificationRepository(db);
    const service = new NotificationService(repository);
    return { notificationService: service, notificationRepository: repository };
  })

  .post('/notifications', async ({ body, notificationRepository }) => {
    try {
      const data = body as any;
      const notification = await notificationRepository.createNotification(
        data.type,
        data.config
      );
      return { success: true, notification };
    } catch (error) {
      console.error('[Notifications] Create error:', error);
      return ResponseHelper.error(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  })

  .get('/notifications', async ({ notificationRepository }) => {
    try {
      return await notificationRepository.getAllNotifications();
    } catch (error) {
      console.error('[Notifications] Get all error:', error);
      return ResponseHelper.error(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  })

  .patch('/notifications/:id', async ({ params, body, notificationRepository }) => {
    try {
      await notificationRepository.updateNotification(params.id, body as any);
      return { success: true };
    } catch (error) {
      console.error('[Notifications] Update error:', error);
      return ResponseHelper.error(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  })

  .delete('/notifications/:id', async ({ params, notificationRepository }) => {
    try {
      await notificationRepository.deleteNotification(params.id);
      return { success: true };
    } catch (error) {
      console.error('[Notifications] Delete error:', error);
      return ResponseHelper.error(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  })

  .post('/notifications/:id/test', async ({ params, store, notificationRepository }) => {
    try {
      const notification = await notificationRepository.getNotificationById(params.id);

      if (!notification) {
        return { success: false, error: 'Notification not found' };
      }

      const testService = {
        id: 'test',
        name: 'Test Service',
        url: 'https://example.com',
        method: 'GET',
        timeout: 10000,
        expectedStatus: 200,
        createdAt: new Date(),
      };

      const testIncident = {
        responseTime: 150,
        statusCode: 500,
        error: 'This is a test notification',
      };

      const baseUrl = (store as any).BASE_URL || 'http://localhost:3000';

      if (notification.type === 'telegram') {
        await TelegramProvider.send(notification.config as any, testService, testIncident, baseUrl);
      } else if (notification.type === 'slack') {
        await SlackProvider.send(notification.config as any, testService, testIncident, baseUrl);
      }

      return { success: true };
    } catch (error) {
      console.error('[Notifications] Test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
