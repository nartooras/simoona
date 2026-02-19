import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appRoutes } from './AppRouter';
import { navigationGroups, navigationRouteDefinitions, routeAvailabilityMap, routeStatusMatrix } from './navigation';
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
        expect(screen.getByTestId('route-contract-marker')).toHaveAttribute('data-route-path', '/health');
        expect(screen.getByTestId('route-contract-marker')).toHaveAttribute('data-route-availability', 'real');
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

    it('renders dedicated wall route with switching and filter controls', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/wall'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'Wall' })).toBeInTheDocument();
        expect(screen.getByTestId('route-contract-marker')).toHaveAttribute('data-route-path', '/wall');
        expect(screen.getByTestId('route-contract-marker')).toHaveAttribute('data-route-availability', 'mock');
        expect(screen.getByTestId('wall-context-select')).toBeInTheDocument();
        expect(screen.getByTestId('wall-sort-select')).toBeInTheDocument();
        expect(screen.getByTestId('wall-category-select')).toBeInTheDocument();
        expect(screen.getByLabelText('Feed stream')).toBeInTheDocument();
        expect(screen.getByLabelText('Wall widgets')).toBeInTheDocument();
    });

    it('renders events route with deterministic control surface and contextual widgets', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/events'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'Events' })).toBeInTheDocument();
        expect(screen.getByTestId('route-contract-marker')).toHaveAttribute('data-route-path', '/events');
        expect(screen.getByTestId('route-contract-marker')).toHaveAttribute('data-route-availability', 'mock');
        expect(screen.getByTestId('events-controls')).toBeInTheDocument();
        expect(screen.getByTestId('events-timeframe-select')).toHaveValue('all');
        expect(screen.getByTestId('events-office-select')).toHaveValue('all');
        expect(screen.getByTestId('events-type-select')).toHaveValue('all');
        expect(screen.getByTestId('events-sort-select')).toHaveValue('soonest');
        expect(screen.getByTestId('events-create-cta')).toBeDisabled();
        expect(await screen.findByTestId('events-upcoming-success')).toBeInTheDocument();
        expect(screen.getByTestId('events-widgets-success')).toBeInTheDocument();
    });

    it('renders kudos route with deterministic feed controls and disabled give CTA', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/kudos'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'Kudos' })).toBeInTheDocument();
        expect(screen.getByTestId('route-contract-marker')).toHaveAttribute('data-route-path', '/kudos');
        expect(screen.getByTestId('route-contract-marker')).toHaveAttribute('data-route-availability', 'mock');
        expect(screen.getByTestId('kudos-controls')).toBeInTheDocument();
        expect(screen.getByTestId('kudos-period-select')).toHaveValue('quarter-to-date');
        expect(screen.getByTestId('kudos-type-select')).toHaveValue('all');
        expect(screen.getByTestId('kudos-team-select')).toHaveValue('all');
        expect(screen.getByTestId('kudos-give-cta')).toBeDisabled();
        expect(await screen.findByTestId('kudos-feed-success')).toBeInTheDocument();
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

    it('reaches every major nav destination with heading and primary content region', async () => {
        vi.spyOn(globalThis, 'fetch').mockImplementation(
            () => new Promise(() => {}) as ReturnType<typeof fetch>,
        );

        const headingByPath: Record<string, string> = {
            '/': 'Home',
            '/employees': 'Employee Directory',
        };

        for (const routeDefinition of navigationRouteDefinitions) {
            const router = createMemoryRouter(appRoutes, {
                initialEntries: [routeDefinition.path],
            });
            const { unmount } = render(<RouterProvider router={router} />);
            const expectedHeading = headingByPath[routeDefinition.path] ?? routeDefinition.label;

            expect(await screen.findByRole('heading', { name: expectedHeading })).toBeInTheDocument();
            expect(screen.getByTestId('route-contract-marker')).toHaveAttribute('data-route-path', routeDefinition.path);
            expect(screen.getByTestId('route-contract-marker')).toHaveAttribute('data-route-availability', routeDefinition.availability);
            expect(screen.getByTestId('destination-content-region')).toBeInTheDocument();
            expect(screen.getByTestId('destination-content-region')).toHaveAttribute(
                'data-page-theme',
                'legacy-unified-wave7',
            );
            expect(screen.getByRole('main')).toBeInTheDocument();

            unmount();
        }
    });

    it('keeps prototype availability notice labels consistent with route metadata', async () => {
        vi.spyOn(globalThis, 'fetch').mockImplementation(
            () => new Promise(() => {}) as ReturnType<typeof fetch>,
        );

        const availabilityLabelByMode = {
            real: 'Real.',
            mock: 'Mock.',
            disabled: 'Disabled.',
        } as const;

        for (const routeDefinition of navigationRouteDefinitions) {
            const availability = routeAvailabilityMap[routeDefinition.path];
            const router = createMemoryRouter(appRoutes, {
                initialEntries: [routeDefinition.path],
            });
            const { unmount } = render(<RouterProvider router={router} />);

            expect(
                screen.getByText(`Prototype availability: ${availabilityLabelByMode[availability.mode]}`),
            ).toBeInTheDocument();
            expect(screen.getByTestId('destination-content-region')).toHaveAttribute('data-route-status', availability.mode);
            expect(screen.getByTestId('destination-content-region')).toHaveAttribute(
                'data-page-theme',
                'legacy-unified-wave7',
            );

            unmount();
        }
    });

    it('keeps route contract notes aligned with route status matrix metadata', async () => {
        const headingByPath: Record<string, string> = {
            '/': 'Home',
            '/employees': 'Employee Directory',
        };

        for (const routeEntry of routeStatusMatrix) {
            const router = createMemoryRouter(appRoutes, {
                initialEntries: [routeEntry.route],
            });
            const { unmount } = render(<RouterProvider router={router} />);
            const expectedHeading = headingByPath[routeEntry.route] ?? routeEntry.label;
            const marker = screen.getByTestId('route-contract-marker');

            expect(await screen.findByRole('heading', { name: expectedHeading })).toBeInTheDocument();
            expect(marker).toHaveTextContent(routeEntry.demoNote);
            expect(marker).toHaveAttribute('data-route-mode', routeEntry.destinationMode);

            unmount();
        }
    });

    it('keeps navigation and route definitions aligned for all prototype entries', () => {
        const navRoutes = navigationGroups.flatMap((group) => group.items.map((item) => item.to)).sort();
        const metadataRoutes = navigationRouteDefinitions.map((entry) => entry.path).sort();
        const appRoutePaths = appRoutes
            .map((route) => route.path)
            .filter((path): path is string => typeof path === 'string' && path !== '*')
            .sort();

        expect(navRoutes).toEqual(metadataRoutes);
        expect(appRoutePaths).toEqual(metadataRoutes);
    });
});
