import { eq } from 'drizzle-orm';
import type { Database } from '@/shared/database';
import { notifications } from '@/shared/database/schema';
import type { Notification } from '@/shared/types';

export class NotificationRepository {
  constructor(private db: Database) {}

  async createNotification(
    type: 'telegram' | 'slack',
    config: Record<string, any>
  ): Promise<Notification> {
    const notification = {
      id: crypto.randomUUID(),
      type,
      enabled: true,
      config: JSON.stringify(config),
      createdAt: new Date(),
    };

    await this.db.insert(notifications).values(notification);

    return {
      ...notification,
      config,
    };
  }

  async getAllNotifications(): Promise<Notification[]> {
    const results = await this.db.select().from(notifications).all();
    return results.map(n => ({
      ...n,
      config: JSON.parse(n.config),
    }));
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    const result = await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .get();

    if (!result) return null;

    return {
      ...result,
      config: JSON.parse(result.config),
    };
  }

  async updateNotification(
    id: string,
    data: { enabled?: boolean; config?: Record<string, any> }
  ): Promise<void> {
    const updateData: any = {};

    if (data.enabled !== undefined) {
      updateData.enabled = data.enabled;
    }

    if (data.config) {
      updateData.config = JSON.stringify(data.config);
    }

    await this.db
      .update(notifications)
      .set(updateData)
      .where(eq(notifications.id, id));
  }

  async deleteNotification(id: string): Promise<void> {
    await this.db.delete(notifications).where(eq(notifications.id, id));
  }

  async getEnabledNotifications(): Promise<Notification[]> {
    const results = await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.enabled, true))
      .all();

    return results.map(n => ({
      ...n,
      config: JSON.parse(n.config),
    }));
  }
}
