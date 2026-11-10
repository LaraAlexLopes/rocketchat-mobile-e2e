import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface Credentials {
  username: string;
  password: string;
}

export interface Session {
  userId: string;
  authToken: string;
}

export class ApiError extends Error {
  constructor(
    readonly endpoint: string,
    readonly status: number,
    readonly body: { error?: string; errorType?: string; message?: string },
  ) {
    super(`${endpoint} failed with ${status}: ${body.error ?? body.message ?? 'unknown error'}`);
    this.name = 'ApiError';
  }
}

type Query = Record<string, string | number | string[]>;

export class ApiClient {
  private constructor(private readonly session: Session) {}

  static async login({ username, password }: Credentials): Promise<ApiClient> {
    const response = await ApiClient.send<{ data: Session }>('POST', 'login', undefined, { user: username, password });
    return new ApiClient({ userId: response.data.userId, authToken: response.data.authToken });
  }

  get userId(): string {
    return this.session.userId;
  }

  get<T>(endpoint: string, query: Query = {}): Promise<T> {
    return ApiClient.send<T>('GET', endpoint, this.session, undefined, query);
  }

  post<T>(endpoint: string, body: object = {}): Promise<T> {
    return ApiClient.send<T>('POST', endpoint, this.session, body);
  }

  private static async send<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    session?: Session,
    body?: object,
    query: Query = {},
  ): Promise<T> {
    const url = new URL(`/api/v1/${endpoint}`, env.apiUrl);
    for (const [key, value] of Object.entries(query)) {
      for (const item of Array.isArray(value) ? value : [value]) {
        url.searchParams.append(Array.isArray(value) ? `${key}[]` : key, String(item));
      }
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (session) {
      headers['X-User-Id'] = session.userId;
      headers['X-Auth-Token'] = session.authToken;
    }

    logger.debug(`${method} ${url.pathname}${url.search}`);
    const response = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const payload = (await response.json().catch(() => ({}))) as T & { success?: boolean; status?: string };

    if (!response.ok || payload.success === false) {
      throw new ApiError(endpoint, response.status, payload as ApiError['body']);
    }
    return payload;
  }
}
