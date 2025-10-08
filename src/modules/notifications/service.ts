import type { NotificationRepository } from './repository';
import type { Service, TelegramConfig, SlackConfig } from '@/shared/types';
import { TelegramProvider } from './providers/telegram';
import { SlackProvider } from './providers/slack';

export class NotificationService {
  constructor(private repository: NotificationRepository) {}

  async sendAlert(
    service: Service,
    incident: { responseTime: number; statusCode: number; error?: string },
    baseUrl: string
  ): Promise<void> {
    try {
      const notifications = await this.repository.getEnabledNotifications();

      if (notifications.length === 0) {
        console.log('[NOTIFICATION] No enabled integrations');
        return;
      }

      console.log(`[NOTIFICATION] Sending to ${notifications.length} integration(s)`);

      for (const notification of notifications) {
        try {
          if (notification.type === 'telegram') {
            await TelegramProvider.send(
              notification.config as TelegramConfig,
              service,
              incident,
              baseUrl
            );
            console.log('[NOTIFICATION] Sent to Telegram');
          } else if (notification.type === 'slack') {
            await SlackProvider.send(
              notification.config as SlackConfig,
              service,
              incident,
              baseUrl
            );
            console.log('[NOTIFICATION] Sent to Slack');
          }
        } catch (error) {
          console.error(`[NOTIFICATION] Failed to send ${notification.type}:`, error);
        }
      }
    } catch (error) {
      console.error('[NOTIFICATION] Error in sendAlert:', error);
    }
  }
}
