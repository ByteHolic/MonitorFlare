import { AuthService } from './service';

export function createAuthMiddleware(authService: AuthService) {
  return async (headers: Record<string, string | undefined>): Promise<boolean> => {
    return authService.verifyCookie(headers.cookie);
  };
}
