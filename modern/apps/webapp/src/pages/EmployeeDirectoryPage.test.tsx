import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EmployeeDirectoryPage } from './EmployeeDirectoryPage';
import '../i18n';

const successPayload = {
    pagedList: [
        {
            id: 'user-1',
            firstName: 'Ada',
            lastName: 'Lovelace',
            jobTitle: 'Engineering Manager',
            email: 'ada@example.com',
        },
    ],
    pageCount: 1,
    itemCount: 1,
    pageSize: 10,
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

describe('EmployeeDirectoryPage', () => {
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

        render(<EmployeeDirectoryPage />);

        expect(await screen.findByRole('heading', { name: 'Employee Directory' })).toBeInTheDocument();
        expect(screen.getByText('Loading employee directory...')).toBeInTheDocument();

        resolveResponse?.(jsonResponse(200, successPayload));
        expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
    });

    it('renders directory on successful response', async () => {
        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(jsonResponse(200, successPayload));

        render(<EmployeeDirectoryPage />);

        expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
        expect(screen.getByText('Engineering Manager')).toBeInTheDocument();

        const [requestPath, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(requestPath).toBe('/api/v1/employees');
        const headers = new Headers(requestInit.headers);
        expect(headers.get('X-Org-Id')).toBe('7');
        expect(headers.get('Authorization')).toBe('Bearer test-token');
    });

    it('renders not found state for 404 response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(404));

        render(<EmployeeDirectoryPage />);

        expect(await screen.findByText('Employee directory data was not found.')).toBeInTheDocument();
    });

    it('renders unauthorized state for 401 response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(401));

        render(<EmployeeDirectoryPage />);

        expect(
            await screen.findByText('You are not authorized. Sign in and try again.'),
        ).toBeInTheDocument();
    });

    it('renders generic error state for server errors', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(emptyResponse(500));

        render(<EmployeeDirectoryPage />);

        expect(
            await screen.findByText('Something went wrong while loading employee directory.'),
        ).toBeInTheDocument();
    });
});
