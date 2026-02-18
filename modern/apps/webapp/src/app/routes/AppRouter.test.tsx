import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appRoutes } from './AppRouter';
import { navigationGroups } from './navigation';
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
        expect(screen.getByText('Status: OK. Modern API baseline is healthy for demo start.')).toBeInTheDocument();
        expect(screen.getByText('Prototype availability: Real.')).toBeInTheDocument();
    });

    it('renders home wall layout shell', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument();
        expect(screen.getByLabelText('Feed stream')).toBeInTheDocument();
        expect(screen.getByLabelText('Wall widgets')).toBeInTheDocument();
        expect(screen.getByTestId('wall-content-grid')).toBeInTheDocument();
        expect(screen.getByTestId('wall-feed-column')).toBeInTheDocument();
        expect(screen.getByTestId('wall-widgets-column')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Kudos Feed' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Upcoming Events' })).toBeInTheDocument();
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
        expect(screen.getByText('Prototype availability: Real.')).toBeInTheDocument();
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
        expect(screen.getByText('Prototype availability: Mock.')).toBeInTheDocument();
        expect(screen.getByText('Today posts')).toBeInTheDocument();
    });

    it('renders disabled prototype route', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/externals/integrations'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'Integrations' })).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Prototype availability: Disabled.');
        expect(screen.getByText('Marketplace')).toBeInTheDocument();
    });

    it('reaches all new prototype routes with standard semantics', async () => {
        const cases = [
            { path: '/events', heading: 'Events', availability: 'Mock.' },
            { path: '/vacations', heading: 'Vacations', availability: 'Mock.' },
            { path: '/kudos', heading: 'Kudos', availability: 'Mock.' },
            { path: '/books', heading: 'Books', availability: 'Mock.' },
            { path: '/service-requests', heading: 'Service Requests', availability: 'Disabled.' },
            { path: '/projects', heading: 'Projects', availability: 'Mock.' },
            { path: '/office-map', heading: 'Office Map', availability: 'Mock.' },
            { path: '/organization/structure', heading: 'Organizational Structure', availability: 'Mock.' },
            { path: '/committees', heading: 'Committees', availability: 'Mock.' },
        ];

        for (const routeCase of cases) {
            const router = createMemoryRouter(appRoutes, {
                initialEntries: [routeCase.path],
            });
            const { unmount } = render(<RouterProvider router={router} />);

            expect(await screen.findByRole('heading', { name: routeCase.heading })).toBeInTheDocument();
            const noticeRole = routeCase.availability === 'Disabled.' ? 'alert' : 'status';
            expect(screen.getByRole(noticeRole)).toHaveTextContent(`Prototype availability: ${routeCase.availability}`);
            expect(screen.getByRole('main')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Available now' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Unavailable in prototype' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Planned next wave' })).toBeInTheDocument();
            const actionPanel = screen.getByLabelText('Prototype actions');
            const actionButton = actionPanel.querySelector('button');
            expect(actionButton).not.toBeNull();
            expect(actionButton).toBeDisabled();

            unmount();
        }
    });

    it('keeps navigation and route definitions aligned for all prototype entries', () => {
        const navRoutes = navigationGroups.flatMap((group) => group.items.map((item) => item.to)).sort();
        const appRoutePaths = appRoutes
            .map((route) => route.path)
            .filter((path): path is string => typeof path === 'string' && path !== '*')
            .sort();

        expect(appRoutePaths).toEqual(navRoutes);
    });
});
