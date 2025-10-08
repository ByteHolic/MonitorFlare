import type { Service, SlackConfig } from '@/shared/types';

export class SlackProvider {
  static async send(
    config: SlackConfig,
    service: Service,
    incident: { responseTime: number; statusCode: number; error?: string },
    baseUrl: string
  ): Promise<void> {
    const statusColor = incident.statusCode === 0 ? '#DC2626' : '#F59E0B';
    const statusEmoji = incident.statusCode === 0 ? ':x:' : ':warning:';

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attachments: [
          {
            color: statusColor,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `${statusEmoji} Service Down Alert`,
                  emoji: true,
                },
              },
              {
                type: 'section',
                fields: [
                  { type: 'mrkdwn', text: `*Service:*\n${service.name}` },
                  {
                    type: 'mrkdwn',
                    text: `*Status:*\n${incident.statusCode || 'Connection Failed'}`,
                  },
                  { type: 'mrkdwn', text: `*Method:*\n${service.method}` },
                  {
                    type: 'mrkdwn',
                    text: `*Response Time:*\n${incident.responseTime}ms`,
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Expected:*\n${service.expectedStatus}`,
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Time:*\n${new Date().toLocaleString()}`,
                  },
                ],
              },
              {
                type: 'section',
                text: { type: 'mrkdwn', text: `*URL:*\n\`${service.url}\`` },
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Error:*\n\`\`\`${incident.error || 'Unexpected status code'}\`\`\``,
                },
              },
              { type: 'divider' },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    text: { type: 'plain_text', text: '📊 View Details', emoji: true },
                    style: 'primary',
                    url: `${baseUrl}/monitoring/${service.id}`,
                  },
                  {
                    type: 'button',
                    text: { type: 'plain_text', text: '🌐 Open URL', emoji: true },
                    url: service.url,
                  },
                  {
                    type: 'button',
                    text: { type: 'plain_text', text: '📈 Status Page', emoji: true },
                    url: baseUrl,
                  },
                ],
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`);
    }
  }
}
