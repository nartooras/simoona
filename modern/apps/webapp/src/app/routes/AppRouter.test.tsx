import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appRoutes } from './AppRouter';
import '../../i18n';

describe('AppRouter', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_ORGANIZATION_ID', '7');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it('renders health route', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/health'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'Health' })).toBeInTheDocument();
        expect(screen.getByText('Status: OK')).toBeInTheDocument();
    });

    it('renders user-info route', async () => {
        vi.spyOn(globalThis, 'fetch').mockImplementation(
            () => new Promise(() => {}) as ReturnType<typeof fetch>,
        );

        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/user-info'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'User Info' })).toBeInTheDocument();
        expect(screen.getByText('Loading user information...')).toBeInTheDocument();
    });
});
