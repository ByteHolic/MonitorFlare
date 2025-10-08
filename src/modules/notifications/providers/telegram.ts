import type { Service, TelegramConfig } from '@/shared/types';

export class TelegramProvider {
  static async send(
    config: TelegramConfig,
    service: Service,
    incident: { responseTime: number; statusCode: number; error?: string },
    baseUrl: string
  ): Promise<void> {
    const statusEmoji = incident.statusCode === 0 ? '💥' : '⚠️';
    const timeEmoji = incident.responseTime > 5000 ? '🐌' : '⏱️';

    const message = `${statusEmoji} *SERVICE DOWN ALERT*

━━━━━━━━━━━━━━━━━━━━

🏷️ *Service:* \`${service.name}\`

🌐 *Endpoint:*
\`${service.url}\`

📊 *Details:*
• Method: \`${service.method}\`
• Expected: \`${service.expectedStatus}\`
• Received: \`${incident.statusCode || 'Connection Failed'}\`
• ${timeEmoji} Response: \`${incident.responseTime}ms\`

❌ *Error:*
\`${incident.error || 'Unexpected status code'}\`

🕐 *Time:*
\`${new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Tehran',
      dateStyle: 'medium',
      timeStyle: 'medium',
    })}\`

━━━━━━━━━━━━━━━━━━━━`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '📊 View Details', url: `${baseUrl}/monitoring/${service.id}` }],
        [
          { text: '🌐 Open URL', url: service.url },
          { text: '📈 Status Page', url: baseUrl },
        ],
      ],
    };

    const response = await fetch(
      `https://api.telegram.org/bot${config.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: message,
          parse_mode: 'Markdown',
          reply_markup: keyboard,
          disable_web_page_preview: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Telegram API error: ${response.status} - ${error}`);
    }
  }
}
