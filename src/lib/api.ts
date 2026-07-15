const BASE_URL = import.meta.env.VITE_API_BASE ?? '/api'

export class ApiError extends Error {
  status: number
  body: string
  constructor(status: number, body: string) {
    super(`API ${status}: ${body || '(empty body)'}`)
    this.status = status
    this.body = body
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  headers.set('Accept', 'application/json')

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })
  if (!res.ok) {
    throw new ApiError(res.status, await res.text())
  }
  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown, options?: { keepalive?: boolean }) =>
    apiFetch<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
      keepalive: options?.keepalive,
    }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(
      path,
      body !== undefined
        ? { method: 'PATCH', body: JSON.stringify(body) }
        : { method: 'PATCH' },
    ),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
}
