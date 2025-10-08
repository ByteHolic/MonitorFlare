export class AuthService {
  constructor(
    private adminUsername: string,
    private adminPassword: string
  ) {}

  login(username: string, password: string): { success: boolean; token?: string } {
    if (username === this.adminUsername && password === this.adminPassword) {
      const token = btoa(`${username}:${password}`);
      return { success: true, token };
    }
    return { success: false };
  }

  verifyToken(token: string): boolean {
    try {
      const decoded = atob(token);
      const [username, password] = decoded.split(':');
      return username === this.adminUsername && password === this.adminPassword;
    } catch {
      return false;
    }
  }

  verifyCookie(cookieHeader?: string): boolean {
    if (!cookieHeader) return false;
    const authToken = cookieHeader.split('auth=')[1]?.split(';')[0];
    if (!authToken) return false;
    return this.verifyToken(authToken);
  }
}
