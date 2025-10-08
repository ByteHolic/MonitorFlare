import { ValidationError } from './errors';

export class Validator {
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidMethod(method: string): boolean {
    return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].includes(method.toUpperCase());
  }

  static validateServiceData(data: {
    name?: string;
    url?: string;
    method?: string;
    timeout?: number;
    expectedStatus?: number;
  }): void {
    if (data.name !== undefined && !data.name.trim()) {
      throw new ValidationError('Service name cannot be empty');
    }

    if (data.url !== undefined && !this.isValidUrl(data.url)) {
      throw new ValidationError('Invalid URL format');
    }

    if (data.method !== undefined && !this.isValidMethod(data.method)) {
      throw new ValidationError('Invalid HTTP method');
    }

    if (data.timeout !== undefined && (data.timeout <= 0 || data.timeout > 60000)) {
      throw new ValidationError('Timeout must be between 1 and 60000ms');
    }
  }
}
