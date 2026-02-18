import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GeneralSettingsPage } from './GeneralSettingsPage';
import '../i18n';

const successPayload = {
    languages: [
        {
            displayName: 'English (United States)',
            name: 'en-US',
            isSelected: true,
        },
    ],
    timeZones: [
        {
            id: 'UTC',
            displayName: 'UTC',
            isSelected: true,
        },
    ],
};

function jsonResponse(status: number, body: unknown): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function emptyResponse(status: number): Response {
    return new Response(null, { status });
}

describe('GeneralSettingsPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_ORGANIZATION_ID', '7');
        vi.stubEnv('VITE_API_BEARER_TOKEN', 'test-token');
    });

    afterEach(() => {
        cleanup();
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it('renders loading state while request is in flight', async () => {
        let resolveResponse: ((value: Response) => void) | undefined;
        const pendingResponse = new Promise<Response>((resolve) => {
            resolveResponse = resolve;
        });

        vi.spyOn(globalThis, 'fetch').mockReturnValue(pendingResponse as ReturnType<typeof fetch>);

        render(<GeneralSettingsPage />);

        expect(await screen.findByRole('heading', { name: 'General Settings' })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Loading general settings...');

        resolveResponse?.(jsonResponse(200, successPayload));
        expect(await screen.findByText('English (United States)')).toBeInTheDocument();
    });

    it('renders selected language and time zone on successful response', async () => {
        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(jsonResponse(200, successPayload));

        render(<GeneralSettingsPage />);

        expect(await screen.findByText('English (United States)')).toBeInTheDocument();
        expect(screen.getByText('UTC')).toBeInTheDocument();
        expect(screen.getByText('Read-only settings snapshot from the modern API contract.')).toBeInTheDocument();

        const [requestPath, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(requestPath).toBe('/api/v1/user/general-settings');
        const headers = new Headers(requestInit.headers);
        expect(headers.get('X-Org-Id')).toBe('7');
        expect(headers.get('Authorization')).toBe('Bearer test-token');
    });

    it('renders unauthorized state for 401 response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(401));

        render(<GeneralSettingsPage />);

        expect(
            await screen.findByText('You are not authorized. Sign in and try again.'),
        ).toBeInTheDocument();
    });

    it('renders generic error state for server errors', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(500));

        render(<GeneralSettingsPage />);

        expect(
            await screen.findByText('Something went wrong while loading general settings.'),
        ).toBeInTheDocument();
    });

    it('renders empty state for 404 response from modern API', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(404));

        render(<GeneralSettingsPage />);

        expect(
            await screen.findByText('General settings were returned without language or time zone options.'),
        ).toBeInTheDocument();
    });
});
