const DEFAULT_BASE_URL = '/api';

export type ApiRequestInit = Omit<RequestInit, 'body'> & {
    body?: unknown;
};

export class ApiHttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly payload?: unknown,
    ) {
        super(`API request failed: ${status} ${statusText}`);
        this.name = 'ApiHttpError';
    }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;

export function getApiBaseUrl(): string {
    return apiBaseUrl;
}

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
        let payload: unknown;

        try {
            payload = await response.json();
        } catch {
            payload = undefined;
        }

        throw new ApiHttpError(response.status, response.statusText, payload);
    }

    return (await response.json()) as TResponse;
}
