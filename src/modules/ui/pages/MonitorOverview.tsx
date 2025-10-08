import { Html } from '@elysiajs/html'

export function MonitorOverview({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Monitor Overview</title>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.min.css" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          body { background: #fafafa; margin: 0; }
          .timeline-row {
            display: flex; gap: 2px; background: white;
            padding: 12px; border-radius: 6px; border: 1px solid #e5e5e5;
          }
          .timeline-bar {
            flex: 1; height: 34px; border-radius: 2px;
            transition: all 0.2s; cursor: pointer;
          }
          .timeline-bar:hover { opacity: 0.8; transform: scaleY(1.05); }
          .status-badge {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;
          }
          .operational { background: #d1fae5; color: #065f46; }
          .degraded { background: #fef3c7; color: #92400e; }
          .down { background: #fee2e2; color: #991b1b; }
        `}</style>
      </head>
      <body>
        <div style="padding: 40px 20px; max-width: 100%; min-height: 100vh;">
          <div style="max-width: 1400px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 50px; flex-wrap: wrap; gap: 20px;">
              <div>
                <h1 style="font-size: 36px; font-weight: 600; margin: 0 0 12px 0;">Monitor Overview</h1>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div id="status-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></div>
                  <p style="font-size: 14px; color: #666; margin: 0;" id="status-text">All systems operational</p>
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                {isAdmin ? (
                  <a href="/admin" style="padding: 8px 16px; background: #000; color: white; border: none; border-radius: 6px; font-size: 14px; text-decoration: none; display: inline-block;">
                    Admin Dashboard
                  </a>
                ) : (
                  <a href="/admin/login" style="padding: 8px 16px; background: white; color: #000; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px; text-decoration: none; display: inline-block;">
                    Admin
                  </a>
                )}
              </div>
            </div>
            <div id="services"></div>
          </div>
        </div>

        <script>{`
          const BASE = window.location.origin;
          
          async function load() {
            const res = await fetch(BASE + '/api/services');
            const services = await res.json();
            
            const container = document.getElementById('services');
            if (!services.length) {
              container.innerHTML = '<div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 60px; text-align: center; color: #999;">No services configured yet</div>';
              return;
            }
            
            const allUp = services.every(s => s.uptime >= 99);
            document.getElementById('status-dot').style.background = allUp ? '#10b981' : '#f59e0b';
            document.getElementById('status-text').textContent = allUp ? 'All systems operational' : 'Some systems degraded';
            
            container.innerHTML = services.map(s => {
              const statusClass = s.uptime >= 99 ? 'operational' : s.uptime >= 95 ? 'degraded' : 'down';
              const statusText = s.uptime >= 99 ? 'Operational' : s.uptime >= 95 ? 'Degraded' : 'Down';
              
              return \`
                <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                    <div style="flex: 1; min-width: 250px;">
                      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap;">
                        <h2 style="font-size: 18px; font-weight: 600; margin: 0;">\${s.name}</h2>
                        <span class="status-badge \${statusClass}">
                          <div style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></div>
                          \${statusText}
                        </span>
                      </div>
                      <a href="\${s.url}" target="_blank" style="font-size: 13px; color: #666; text-decoration: none; word-break: break-all;">
                        \${s.url}
                      </a>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 28px; font-weight: 600; color: \${s.uptime >= 99 ? '#10b981' : s.uptime >= 95 ? '#f59e0b' : '#ef4444'};">
                        \${s.uptime.toFixed(1)}%
                      </div>
                      <div style="font-size: 12px; color: #999;">uptime</div>
                    </div>
                  </div>
                  
                  <div style="border-top: 1px solid #e5e5e5; padding-top: 16px;">
                    <div style="font-size: 12px; color: #999; margin-bottom: 8px;">Last 24 hours</div>
                    <div class="timeline-row" id="timeline-\${s.id}"></div>
                    <div style="margin-top: 12px;">
                      <a href="/monitoring/\${s.id}" style="font-size: 13px; color: #666; text-decoration: none;">
                        View details →
                      </a>
                    </div>
                  </div>
                </div>
              \`;
            }).join('');
            
            services.forEach(s => loadTimeline(s.id));
          }
          
          async function loadTimeline(id) {
            const res = await fetch(BASE + '/api/services/' + id + '/checks');
            const checks = await res.json();
            const timeline = document.getElementById('timeline-' + id);
            
            if (!checks.length) {
              timeline.innerHTML = '<div class="timeline-bar" style="background: #e5e5e5;"></div>';
              return;
            }
            
            checks.slice(0, 1440).reverse().forEach(c => {
              const bar = document.createElement('div');
              bar.className = 'timeline-bar';
              bar.style.background = c.status === 'healthy' ? (c.responseTime > 1000 ? '#f59e0b' : '#10b981') : '#ef4444';
              timeline.appendChild(bar);
            });
          }
          
          load();
          setInterval(load, 30000);
        `}</script>
      </body>
    </html>
  );
}
