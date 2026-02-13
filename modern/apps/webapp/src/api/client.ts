const DEFAULT_BASE_URL = '/api';

export type ApiRequestInit = Omit<RequestInit, 'body'> & {
    body?: unknown;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;

export async function apiFetch<TResponse>(
    path: string,
    init: ApiRequestInit = {},
): Promise<TResponse> {
    const headers = new Headers(init.headers);

    if (init.body !== undefined && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...init,
        headers,
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as TResponse;
}
