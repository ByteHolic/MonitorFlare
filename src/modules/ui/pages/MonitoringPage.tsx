import { Html } from '@elysiajs/html'

interface Props {
  service: any;
  checks: any[];
  uptime: number;
  isAdmin?: boolean;
}

export function MonitoringPage({ service, checks, uptime, isAdmin = false }: Props) {
  const avgResponse = checks.length 
    ? Math.round(checks.reduce((a: number, c: any) => a + c.responseTime, 0) / checks.length) 
    : 0;
  
  const failedChecks = checks.filter((c: any) => c.status === 'unhealthy').length;
  const recentIncidents = checks.filter((c: any) => c.status === 'unhealthy').slice(0, 20);

  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>{service.name} - Monitoring</title>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.min.css" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          body { background: #fafafa; margin: 0; }
          .timeline-row {
            display: flex; gap: 2px; background: white;
            padding: 16px; border-radius: 6px; border: 1px solid #e5e5e5;
          }
          .timeline-bar {
            flex: 1; height: 40px; border-radius: 2px;
            transition: all 0.2s; cursor: pointer;
          }
          .timeline-bar:hover { opacity: 0.8; transform: scaleY(1.05); }
          .status-badge {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;
          }
          .operational { background: #d1fae5; color: #065f46; }
          .degraded { background: #fef3c7; color: #92400e; }
          .down { background: #fee2e2; color: #991b1b; }
        `}</style>
      </head>
      <body>
        <div style="padding: 40px 20px; max-width: 100%; min-height: 100vh;">
          <div style="max-width: 1400px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
              <a href="/" style="display: inline-block; color: #666; text-decoration: none; font-size: 14px;">
                ← Back to all services
              </a>
              {isAdmin && (
                <a
                  href="/admin"
                  style="
                    padding: 8px 16px;
                    background: #000;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    text-decoration: none;
                    display: inline-block;
                  "
                >
                  Admin Dashboard
                </a>
              )}
            </div>
            <div style="margin-bottom: 50px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap;">
                <h1 style="font-size: 36px; font-weight: 600; margin: 0;">{service.name}</h1>
                <span class={`status-badge ${uptime >= 99 ? 'operational' : uptime >= 95 ? 'degraded' : 'down'}`}>
                  <div style="width: 8px; height: 8px; border-radius: 50%; background: currentColor;"></div>
                  {uptime >= 99 ? 'Operational' : uptime >= 95 ? 'Degraded Performance' : 'Major Outage'}
                </span>
              </div>
              <a href={service.url} target="_blank" style="color: #666; font-size: 14px; text-decoration: none; word-break: break-all;">
                {service.url}
              </a>
            </div>

            <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 30px; margin-bottom: 40px;">
              <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px;">
                <div>
                  <div style="font-size: 13px; color: #666; margin-bottom: 8px;">Uptime (24h)</div>
                  <div style={`font-size: 36px; font-weight: 600; color: ${uptime >= 99 ? '#10b981' : uptime >= 95 ? '#f59e0b' : '#ef4444'};`}>
                    {uptime.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div style="font-size: 13px; color: #666; margin-bottom: 8px;">Total Checks</div>
                  <div style="font-size: 36px; font-weight: 600;">{checks.length}</div>
                </div>
                <div>
                  <div style="font-size: 13px; color: #666; margin-bottom: 8px;">Failed Checks</div>
                  <div style="font-size: 36px; font-weight: 600; color: #ef4444;">
                    {failedChecks}
                  </div>
                </div>
                <div>
                  <div style="font-size: 13px; color: #666; margin-bottom: 8px;">Avg Response</div>
                  <div style="font-size: 36px; font-weight: 600;">
                    {avgResponse}<span style="font-size: 20px; color: #666;">ms</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Uptime over the past 24 hours</h2>
              <div class="timeline-row" id="timeline-container"></div>
              <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 12px; color: #999;">
                <span>24 hours ago</span>
                <span>Now</span>
              </div>
            </div>

            <div style="display: flex; gap: 20px; margin-bottom: 40px; font-size: 13px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 16px; height: 16px; background: #10b981; border-radius: 2px;"></div>
                <span style="color: #666;">Operational</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 16px; height: 16px; background: #f59e0b; border-radius: 2px;"></div>
                <span style="color: #666;">Degraded</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 16px; height: 16px; background: #ef4444; border-radius: 2px;"></div>
                <span style="color: #666;">Down</span>
              </div>
            </div>

            <div>
              <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Recent Incidents</h2>
              <div id="incidents">
                {recentIncidents.length === 0 ? (
                  <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 40px; text-align: center; color: #999;">
                    <svg style="width: 48px; height: 48px; margin: 0 auto 16px; opacity: 0.3;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>No incidents in the last 24 hours</div>
                  </div>
                ) : (
                  recentIncidents.map((incident: any) => (
                    <div style="background: white; border: 1px solid #e5e5e5; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 12px;">
                      <div style="display: flex; justify-content: space-between; align-items: start; gap: 16px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                          <div style="font-weight: 600; margin-bottom: 4px; color: #ef4444;">Service Down</div>
                          <div style="font-size: 13px; color: #666;">Response time: {incident.responseTime}ms</div>
                          {incident.statusCode && <div style="font-size: 13px; color: #666; margin-top: 2px;">HTTP Status: {incident.statusCode}</div>}
                          {incident.error && (
                            <div style="font-size: 13px; color: #666; margin-top: 4px; padding: 8px; background: #fef2f2; border-radius: 4px;">
                              {incident.error}
                            </div>
                          )}
                        </div>
                        <div style="text-align: right; font-size: 13px; color: #999; white-space: nowrap;">
                          {new Date(incident.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <script>{`
          const checks = ${JSON.stringify(checks.slice(0, 1440).reverse())};
          const container = document.getElementById('timeline-container');
          if (checks.length === 0) {
            container.innerHTML = '<div class="timeline-bar" style="background: #e5e5e5;"></div>';
          } else {
            checks.forEach(check => {
              const bar = document.createElement('div');
              bar.className = 'timeline-bar';
              if (check.status === 'healthy') {
                bar.style.background = check.responseTime > 1000 ? '#f59e0b' : '#10b981';
              } else {
                bar.style.background = '#ef4444';
              }
              container.appendChild(bar);
            });
          }
        `}</script>
      </body>
    </html>
  );
}
