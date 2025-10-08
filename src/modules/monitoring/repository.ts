import { eq } from 'drizzle-orm';
import type { Database } from '@/shared/database';
import { services } from '@/shared/database/schema';
import type { CreateServiceDTO, Service } from '@/shared/types';
import { CONFIG } from '@/shared/config';

export class MonitoringRepository {
  constructor(private db: Database) {}

  async createService(data: CreateServiceDTO): Promise<Service> {
    const service = {
      id: crypto.randomUUID(),
      name: data.name,
      url: data.url,
      method: data.method || CONFIG.DEFAULT_METHOD,
      timeout: data.timeout || CONFIG.DEFAULT_TIMEOUT,
      expectedStatus: data.expectedStatus || CONFIG.DEFAULT_EXPECTED_STATUS,
      createdAt: new Date(),
    };

    await this.db.insert(services).values(service);
    return service;
  }

  async getServiceById(id: string): Promise<Service | null> {
    const result = await this.db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .get();
    
    return result || null;
  }

  async getAllServices(): Promise<Service[]> {
    return await this.db.select().from(services).all();
  }

  async updateService(id: string, data: Partial<CreateServiceDTO>): Promise<void> {
    await this.db
      .update(services)
      .set(data)
      .where(eq(services.id, id));
  }

  async deleteService(id: string): Promise<void> {
    await this.db.delete(services).where(eq(services.id, id));
  }
}
