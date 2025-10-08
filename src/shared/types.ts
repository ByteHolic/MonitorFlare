export interface Env {
  DB: D1Database;
  BASE_URL: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
}

export interface Service {
  id: string;
  name: string;
  url: string;
  method: string;
  timeout: number;
  expectedStatus: number;
  createdAt: Date;
}

export interface CreateServiceDTO {
  name: string;
  url: string;
  method?: string;
  timeout?: number;
  expectedStatus?: number;
}

export interface HealthCheck {
  id: string;
  serviceId: string;
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  statusCode: number | null; 
  error: string | null;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: 'telegram' | 'slack';
  enabled: boolean;
  config: Record<string, any>;
  createdAt: Date;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface SlackConfig {
  webhookUrl: string;
}
