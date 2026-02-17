import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
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
        expect(screen.getByRole('status')).toHaveTextContent('Prototype availability: Real.');
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
        expect(screen.getByRole('status')).toHaveTextContent('Prototype availability: Real.');
    });

    it('renders general-settings route', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 404 }));

        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/settings/general'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'General Settings' })).toBeInTheDocument();
        expect(screen.getByText(i18next.t('generalSettings.states.empty'))).toBeInTheDocument();
    });

    it('renders employee-directory route', async () => {
        vi.spyOn(globalThis, 'fetch').mockImplementation(
            () => new Promise(() => {}) as ReturnType<typeof fetch>,
        );

        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/employees'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'Employee Directory' })).toBeInTheDocument();
        expect(screen.getByText('Loading employee directory...')).toBeInTheDocument();
    });

    it('renders my-profile route', async () => {
        vi.spyOn(globalThis, 'fetch').mockImplementation(
            () => new Promise(() => {}) as ReturnType<typeof fetch>,
        );

        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/profiles/me'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'My Profile' })).toBeInTheDocument();
        expect(screen.getByText('Loading profile details...')).toBeInTheDocument();
    });

    it('renders mock prototype route', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/activities/feed'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'Activity Feed' })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Prototype availability: Mock.');
        expect(screen.getByText('Today posts')).toBeInTheDocument();
    });

    it('renders disabled prototype route', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/externals/integrations'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'Integrations' })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Prototype availability: Disabled.');
        expect(screen.getByText('Marketplace')).toBeInTheDocument();
    });
});
