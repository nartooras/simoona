import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserInfoPage } from './UserInfoPage';
import '../i18n';

const successPayload = {
    email: 'ada@example.com',
    hasRegistered: true,
    loginProvider: 'Local',
    impersonated: false,
    organizationId: 7,
    userId: 'user-1',
    userName: 'ada.lovelace',
    fullName: 'Ada Lovelace',
    cultureCode: 'en-US',
    timeZone: 'UTC',
    pictureId: null,
    permissions: [],
    roles: [],
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

describe('UserInfoPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_ORGANIZATION_ID', '7');
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

        render(<UserInfoPage />);

        expect(await screen.findByRole('heading', { name: 'User Info' })).toBeInTheDocument();
        expect(screen.getByText('Loading user information...')).toBeInTheDocument();

        resolveResponse?.(jsonResponse(200, successPayload));
        expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
    });

    it('renders user info on successful response', async () => {
        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(jsonResponse(200, successPayload));

        render(<UserInfoPage />);

        expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
        expect(screen.getByText('ada@example.com')).toBeInTheDocument();
        expect(screen.getByText('ada.lovelace')).toBeInTheDocument();

        const [requestPath, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(requestPath).toBe('/api/v1/account/user-info');
        expect(new Headers(requestInit.headers).get('X-Org-Id')).toBe('7');
    });

    it('renders unauthorized state for 401 response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(401));

        render(<UserInfoPage />);

        expect(
            await screen.findByText('You are not authorized. Sign in and try again.'),
        ).toBeInTheDocument();
    });

    it('renders not-found state for 404 response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(404));

        render(<UserInfoPage />);

        expect(await screen.findByText('User information was not found.')).toBeInTheDocument();
    });

    it('renders generic error state for server errors', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(500));

        render(<UserInfoPage />);

        expect(
            await screen.findByText('Something went wrong while loading user information.'),
        ).toBeInTheDocument();
    });

    it('renders bad-request state when organization id config is missing', async () => {
        vi.unstubAllEnvs();
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(200, successPayload));

        render(<UserInfoPage />);

        expect(
            await screen.findByText(
                'User context is incomplete. Check authentication and organization headers.',
            ),
        ).toBeInTheDocument();
        expect(globalThis.fetch).not.toHaveBeenCalled();
    });
});
