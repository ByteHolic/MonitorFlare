import type { MonitoringRepository } from './repository';
import type { CreateServiceDTO } from '@/shared/types';
import { Validator } from '@/shared/validation';

export class MonitoringService {
  constructor(private repository: MonitoringRepository) {}

  async createService(dto: CreateServiceDTO) {
    Validator.validateServiceData(dto);
    return await this.repository.createService(dto);
  }

  async getServiceById(id: string) {
    return await this.repository.getServiceById(id);
  }

  async getAllServices() {
    return await this.repository.getAllServices();
  }

  async updateService(id: string, dto: Partial<CreateServiceDTO>) {
    Validator.validateServiceData(dto);
    return await this.repository.updateService(id, dto);
  }

  async deleteService(id: string) {
    return await this.repository.deleteService(id);
  }
}
