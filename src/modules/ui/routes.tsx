import { Elysia } from 'elysia';
import { html, Html } from '@elysiajs/html';
import { MonitorOverview } from './pages/MonitorOverview';
import { MonitoringPage } from './pages/MonitoringPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { createDatabase } from '@/shared/database';
import { MonitoringRepository } from '../monitoring/repository';
import { HealthRepository } from '../health/repository';
import { AuthService } from '../auth/service';

export const uiRoutes = new Elysia({ aot: false })
    .use(html())

    .get('/', async ({ headers, store, html }) => {
        const authService = new AuthService(
            (store as any).ADMIN_USERNAME || 'admin',
            (store as any).ADMIN_PASSWORD || 'admin123'
        );
        const isAdmin = authService.verifyCookie(headers.cookie);
        return html(<MonitorOverview isAdmin={isAdmin} />);
    })

    .get('/admin/login', ({ html }) => {
        return html(<AdminLogin />);
    })

    .get('/admin', async ({ headers, store, html }) => {
        const authService = new AuthService(
            (store as any).ADMIN_USERNAME || 'admin',
            (store as any).ADMIN_PASSWORD || 'admin123'
        );
        const isAdmin = authService.verifyCookie(headers.cookie);

        if (!isAdmin) {
            return new Response(null, {
                status: 302,
                headers: { Location: '/admin/login' },
            });
        }

        return html(<AdminDashboard />);
    })

    .get('/monitoring/:id', async ({ headers, params, store, html }) => {
        try {
            const db = createDatabase((store as any).DB);
            const monitoringRepo = new MonitoringRepository(db);
            const healthRepo = new HealthRepository(db);

            const service = await monitoringRepo.getServiceById(params.id);

            if (!service) {
                return new Response('Service not found', { status: 404 });
            }

            const checks = await healthRepo.getHealthChecks(params.id);

            const uptime =
                checks.length > 0
                    ? (checks.filter(c => c.status === 'healthy').length / checks.length) * 100
                    : 100;
            const authService = new AuthService(
                (store as any).ADMIN_USERNAME || 'admin',
                (store as any).ADMIN_PASSWORD || 'admin123'
            );
            const isAdmin = authService.verifyCookie(headers.cookie);

            return html(<MonitoringPage service={service} checks={checks} uptime={uptime} isAdmin={isAdmin} />);
        } catch (error) {
            console.error('[UI] Error:', error);
            return new Response(
                `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
                { status: 500 }
            );
        }
    });
