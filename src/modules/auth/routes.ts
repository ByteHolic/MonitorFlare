import { Elysia } from 'elysia';
import { AuthService } from './service';

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .derive(({ store }) => {
    const authService = new AuthService(
      (store as any).ADMIN_USERNAME || 'admin',
      (store as any).ADMIN_PASSWORD || 'admin'
    );
    return { authService };
  })

  .post('/login', ({ body, authService }) => {
    const data = body as any;
    const result = authService.login(data.username, data.password);

    if (result.success) {
      return { success: true, token: result.token };
    }

    return new Response(JSON.stringify({ success: false }), { status: 401 });
  })

  .get('/verify', ({ headers, authService }) => {
    const isValid = authService.verifyCookie(headers.cookie);
    return { valid: isValid };
  });
