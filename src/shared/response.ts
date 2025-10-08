export class ResponseHelper {
  static success<T>(data: T, status = 200): Response {
    return new Response(JSON.stringify({ success: true, data }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static error(message: string, status = 500): Response {
    return new Response(JSON.stringify({ success: false, error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static html(content: string): Response {
    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  static redirect(location: string, status = 302): Response {
    return new Response(null, {
      status,
      headers: { Location: location },
    });
  }
}
