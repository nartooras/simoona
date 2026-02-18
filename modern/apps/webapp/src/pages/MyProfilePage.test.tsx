import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MyProfilePage } from './MyProfilePage';
import '../i18n';

const successPayload = {
    id: 'user-1',
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    jobTitle: 'Engineering Manager',
    department: 'Platform',
    office: 'Vilnius',
    timeZone: 'Europe/Vilnius',
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

describe('MyProfilePage', () => {
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

        render(<MyProfilePage />);

        expect(await screen.findByRole('heading', { name: 'My Profile' })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Loading profile details...');

        resolveResponse?.(jsonResponse(200, successPayload));
        expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
    });

    it('renders profile details on successful response', async () => {
        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(jsonResponse(200, successPayload));

        render(<MyProfilePage />);

        expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
        expect(screen.getByText('Platform')).toBeInTheDocument();
        expect(screen.getByText('Read-only profile snapshot from the modern API contract.')).toBeInTheDocument();

        const [requestPath, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(requestPath).toBe('/api/v1/profiles/me');
        const headers = new Headers(requestInit.headers);
        expect(headers.get('X-Org-Id')).toBe('7');
        expect(headers.get('Authorization')).toBe('Bearer test-token');
    });

    it('renders not found state for 404 response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(404));

        render(<MyProfilePage />);

        expect(await screen.findByText('Profile details were not found.')).toBeInTheDocument();
    });

    it('renders unauthorized state for 401 response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(401));

        render(<MyProfilePage />);

        expect(
            await screen.findByText('You are not authorized. Sign in and try again.'),
        ).toBeInTheDocument();
    });

    it('renders generic error state for server errors', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(500));

        render(<MyProfilePage />);

        expect(
            await screen.findByText('Something went wrong while loading profile details.'),
        ).toBeInTheDocument();
    });
});
