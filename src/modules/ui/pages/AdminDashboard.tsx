import { Html } from '@elysiajs/html'

export function AdminDashboard() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Dashboard</title>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.min.css" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          body { background: #fafafa; margin: 0; }
          .nav-link {
            display: inline-block; padding: 8px 16px; color: #666;
            text-decoration: none; font-size: 14px; border-radius: 6px;
            transition: all 0.2s;
          }
          .nav-link:hover { background: #f5f5f5; color: #000; }
          .nav-link.active { background: #000; color: white; }
          .section { display: none; }
          .section.active { display: block; }
        `}</style>
      </head>
      <body>
        <div style="padding: 40px 20px; max-width: 100%; min-height: 100vh;">
          <div style="max-width: 1400px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-wrap: wrap; gap: 20px;">
              <div>
                <h1 style="font-size: 36px; font-weight: 600; margin: 0;">Admin Dashboard</h1>
              </div>
              <div style="display: flex; gap: 8px;">
                <a href="/" style="padding: 8px 16px; background: white; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px; text-decoration: none; color: #000;">
                  Status Page
                </a>
                <button onclick="logout()" style="padding: 8px 16px; background: white; color: #000; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px; cursor: pointer;">
                  Logout
                </button>
              </div>
            </div>

            <div style="margin-bottom: 30px; display: flex; gap: 4px; flex-wrap: wrap;">
              <a href="#services" class="nav-link active" onclick="showSection('services', event)">Services</a>
              <a href="#notifications" class="nav-link" onclick="showSection('notifications', event)">Notifications</a>
            </div>

            <div id="services-section" class="section active">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-size: 20px; font-weight: 600; margin: 0;">Services</h2>
                <button id="add-service-btn" style="padding: 8px 16px; background: #000; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
                  + Add Service
                </button>
              </div>
              <div id="services-list">
                <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 40px; text-align: center; color: #999;">
                  Loading...
                </div>
              </div>
            </div>

            <div id="notifications-section" class="section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-size: 20px; font-weight: 600; margin: 0;">Notification Integrations</h2>
                <button id="add-notification-btn" style="padding: 8px 16px; background: #000; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
                  + Add Integration
                </button>
              </div>
              <div id="notifications-list">
                <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 40px; text-align: center; color: #999;">
                  Loading...
                </div>
              </div>
            </div>
          </div>
        </div>

        <dialog id="service-modal" class="modal">
          <div class="modal-box" style="max-width: 600px;">
            <h3 id="service-modal-title" style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">Add Service</h3>
            <form id="service-form">
              <input type="hidden" id="service-id" name="id" />
              <div style="margin-bottom: 16px;">
                <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">Service Name</label>
                <input type="text" id="service-name" name="name" placeholder="My API" style="width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px;" required />
              </div>
              <div style="margin-bottom: 16px;">
                <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">URL</label>
                <input type="url" id="service-url" name="url" placeholder="https://api.example.com" style="width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px;" required />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div>
                  <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">Method</label>
                  <select id="service-method" name="method" style="width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px;">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">Timeout (ms)</label>
                  <input type="number" id="service-timeout" name="timeout" value="10000" style="width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px;" required />
                </div>
              </div>
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">Expected Status Code</label>
                <input type="number" id="service-expected" name="expectedStatus" value="200" style="width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px;" required />
              </div>
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button type="button" onclick="closeServiceModal()" style="padding: 8px 16px; background: white; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px; cursor: pointer;">
                  Cancel
                </button>
                <button type="submit" style="padding: 8px 16px; background: #000; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
                  Save
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" class="modal-backdrop"><button>close</button></form>
        </dialog>

        <dialog id="notification-modal" class="modal">
          <div class="modal-box">
            <h3 id="notification-modal-title" style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">Add Notification</h3>
            <form id="notification-form">
              <input type="hidden" id="notification-id" name="id" />
              <div style="margin-bottom: 16px;">
                <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">Type</label>
                <select name="type" id="notification-type" onchange="updateNotificationFields()" style="width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px;">
                  <option value="telegram">Telegram</option>
                  <option value="slack">Slack</option>
                </select>
              </div>
              <div id="telegram-fields">
                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">Bot Token</label>
                  <input type="text" id="telegram-token" name="botToken" placeholder="123456:ABC-DEF..." style="width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px;" />
                </div>
                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">Chat ID</label>
                  <input type="text" id="telegram-chat" name="chatId" placeholder="-1001234567890" style="width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px;" />
                </div>
              </div>
              <div id="slack-fields" style="display: none;">
                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">Webhook URL</label>
                  <input type="url" id="slack-webhook" name="webhookUrl" placeholder="https://hooks.slack.com/services/..." style="width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px;" />
                </div>
              </div>
              <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px;">
                <button type="button" onclick="closeNotificationModal()" style="padding: 8px 16px; background: white; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px; cursor: pointer;">
                  Cancel
                </button>
                <button type="submit" style="padding: 8px 16px; background: #000; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
                  Save
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" class="modal-backdrop"><button>close</button></form>
        </dialog>

        <script>{`
          const BASE = window.location.origin;
          let editingService = null;
          let editingNotification = null;
          
          function showSection(section, event) {
            event.preventDefault();
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            event.target.classList.add('active');
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(section + '-section').classList.add('active');
            
            if (section === 'services') loadServices();
            if (section === 'notifications') loadNotifications();
          }
          
          async function loadServices() {
            try {
              const res = await fetch(BASE + '/api/services');
              const services = await res.json();
              const container = document.getElementById('services-list');
              
              if (!services.length) {
                container.innerHTML = '<div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 40px; text-align: center; color: #999;">No services yet</div>';
                return;
              }
              
              container.innerHTML = services.map(s => \`
                <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; gap: 16px; flex-wrap: wrap;">
                    <div style="flex: 1;">
                      <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">\${s.name}</h3>
                      <p style="font-size: 13px; color: #666; margin: 0 0 4px 0; word-break: break-all;">\${s.url}</p>
                      <div style="font-size: 12px; color: #999;">
                        <span>\${s.method}</span> • 
                        <span>\${s.timeout}ms</span> • 
                        <span>Expect \${s.expectedStatus}</span>
                      </div>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: start;">
                      <a href="/monitoring/\${s.id}" style="padding: 6px 12px; background: white; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 13px; text-decoration: none; color: #000;">
                        View
                      </a>
                      <button onclick='editService(\${JSON.stringify(s).replace(/'/g, "\\\\'")})'  style="padding: 6px 12px; background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; border-radius: 4px; font-size: 13px; cursor: pointer;">
                        Edit
                      </button>
                      <button onclick="deleteService('\${s.id}')" style="padding: 6px 12px; background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; border-radius: 4px; font-size: 13px; cursor: pointer;">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              \`).join('');
            } catch (error) {
              console.error('Error loading services:', error);
            }
          }
          
          async function loadNotifications() {
            try {
              const res = await fetch(BASE + '/api/notifications');
              const notifications = await res.json();
              const container = document.getElementById('notifications-list');
              
              if (!notifications.length) {
                container.innerHTML = '<div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 40px; text-align: center; color: #999;">No integrations yet</div>';
                return;
              }
              
              container.innerHTML = notifications.map(n => \`
                <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; gap: 16px; flex-wrap: wrap;">
                    <div style="flex: 1;">
                      <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0; text-transform: capitalize;">\${n.type}</h3>
                      <p style="font-size: 13px; color: #666; word-break: break-all;">\${n.type === 'telegram' ? 'Chat ID: ' + n.config.chatId : 'Webhook configured'}</p>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                      <button onclick="testNotification('\${n.id}', '\${n.type}')" style="padding: 6px 12px; background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; border-radius: 4px; font-size: 13px; cursor: pointer;">
                        Test
                      </button>
                      <button onclick='editNotification(\${JSON.stringify(n).replace(/'/g, "\\\\'")})'  style="padding: 6px 12px; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; border-radius: 4px; font-size: 13px; cursor: pointer;">
                        Edit
                      </button>
                      <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 6px 12px; background: \${n.enabled ? '#d1fae5' : '#f5f5f5'}; border: 1px solid \${n.enabled ? '#a7f3d0' : '#e5e5e5'}; border-radius: 4px;">
                        <input type="checkbox" \${n.enabled ? 'checked' : ''} onchange="toggleNotification('\${n.id}', this.checked)" style="width: 14px; height: 14px;" />
                        <span style="font-size: 13px;">\${n.enabled ? 'On' : 'Off'}</span>
                      </label>
                      <button onclick="deleteNotification('\${n.id}')" style="padding: 6px 12px; background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; border-radius: 4px; font-size: 13px; cursor: pointer;">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              \`).join('');
            } catch (error) {
              console.error('Error loading notifications:', error);
            }
          }
          
          function editService(service) {
            editingService = service;
            document.getElementById('service-modal-title').textContent = 'Edit Service';
            document.getElementById('service-id').value = service.id;
            document.getElementById('service-name').value = service.name;
            document.getElementById('service-url').value = service.url;
            document.getElementById('service-method').value = service.method;
            document.getElementById('service-timeout').value = service.timeout;
            document.getElementById('service-expected').value = service.expectedStatus;
            document.getElementById('service-modal').showModal();
          }
          
          function closeServiceModal() {
            editingService = null;
            document.getElementById('service-modal').close();
            document.getElementById('service-form').reset();
            document.getElementById('service-modal-title').textContent = 'Add Service';
          }
          
          async function deleteService(id) {
            if (!confirm('Delete this service?')) return;
            await fetch(BASE + '/api/services/' + id, { method: 'DELETE' });
            loadServices();
          }
          
          function editNotification(notification) {
            editingNotification = notification;
            document.getElementById('notification-modal-title').textContent = 'Edit Notification';
            document.getElementById('notification-id').value = notification.id;
            document.getElementById('notification-type').value = notification.type;
            
            if (notification.type === 'telegram') {
              document.getElementById('telegram-token').value = notification.config.botToken || '';
              document.getElementById('telegram-chat').value = notification.config.chatId || '';
            } else {
              document.getElementById('slack-webhook').value = notification.config.webhookUrl || '';
            }
            
            updateNotificationFields();
            document.getElementById('notification-modal').showModal();
          }
          
          function closeNotificationModal() {
            editingNotification = null;
            document.getElementById('notification-modal').close();
            document.getElementById('notification-form').reset();
            document.getElementById('notification-modal-title').textContent = 'Add Notification';
          }
          
          async function deleteNotification(id) {
            if (!confirm('Delete this integration?')) return;
            await fetch(BASE + '/api/notifications/' + id, { method: 'DELETE' });
            loadNotifications();
          }
          
          async function toggleNotification(id, enabled) {
            await fetch(BASE + '/api/notifications/' + id, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ enabled })
            });
            loadNotifications();
          }
          
          async function testNotification(id, type) {
            try {
              const res = await fetch(BASE + '/api/notifications/' + id + '/test', {
                method: 'POST'
              });
              if (res.ok) {
                alert('✓ Test notification sent to ' + type);
              } else {
                alert('✗ Failed to send test notification');
              }
            } catch (error) {
              alert('✗ Error sending test notification');
            }
          }
          
          function updateNotificationFields() {
            const type = document.getElementById('notification-type').value;
            document.getElementById('telegram-fields').style.display = type === 'telegram' ? 'block' : 'none';
            document.getElementById('slack-fields').style.display = type === 'slack' ? 'block' : 'none';
          }
          
          document.getElementById('add-service-btn').onclick = () => {
            editingService = null;
            document.getElementById('service-form').reset();
            document.getElementById('service-modal-title').textContent = 'Add Service';
            document.getElementById('service-modal').showModal();
          };
          
          document.getElementById('add-notification-btn').onclick = () => {
            editingNotification = null;
            document.getElementById('notification-form').reset();
            document.getElementById('notification-modal-title').textContent = 'Add Notification';
            document.getElementById('notification-modal').showModal();
          };
          
          document.getElementById('service-form').onsubmit = async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const id = fd.get('id');
            
            const data = {
              name: fd.get('name'),
              url: fd.get('url'),
              method: fd.get('method'),
              timeout: parseInt(fd.get('timeout')),
              expectedStatus: parseInt(fd.get('expectedStatus'))
            };
            
            try {
              if (id) {
                await fetch(BASE + '/api/services/' + id, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });
              } else {
                await fetch(BASE + '/api/services', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });
              }
              closeServiceModal();
              loadServices();
            } catch (error) {
              console.error('Error saving service:', error);
              alert('Error saving service');
            }
          };
          
          document.getElementById('notification-form').onsubmit = async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const id = fd.get('id');
            const type = fd.get('type');
            
            const config = type === 'telegram' 
              ? { botToken: fd.get('botToken'), chatId: fd.get('chatId') }
              : { webhookUrl: fd.get('webhookUrl') };
            
            try {
              if (id) {
                await fetch(BASE + '/api/notifications/' + id, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ config })
                });
              } else {
                await fetch(BASE + '/api/notifications', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ type, config })
                });
              }
              closeNotificationModal();
              loadNotifications();
            } catch (error) {
              console.error('Error saving notification:', error);
              alert('Error saving notification');
            }
          };
          
          function logout() {
            document.cookie = 'auth=;max-age=0';
            location.href = '/admin/login';
          }
          
          loadServices();
        `}</script>
      </body>
    </html>
  );
}
