const DEFAULT_API_BASE_URL =
  typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'http://localhost:3000';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE_URL;

interface ApiClientOptions {
  authenticated?: boolean;
  token?: string | null;
  onUnauthorized?: () => void;
}

export async function apiClient<T>(
  path: string,
  init: RequestInit = {},
  options: ApiClientOptions = {}
): Promise<T> {
  const { authenticated = true, token, onUnauthorized } = options;
  const headers = new Headers(init.headers);

  const isFormData = init.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (authenticated && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers
  });

  if (response.status === 401) {
    onUnauthorized?.();
    throw new Error('Не авторизован');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!response.ok) {
    let message = text;
    try {
      const data = JSON.parse(text);
      message = data.message ?? data.error ?? message;
    } catch (error) {
      // ignore
    }
    throw new Error(message || 'Ошибка запроса');
  }

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
