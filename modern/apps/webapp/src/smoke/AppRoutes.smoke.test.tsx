import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appRoutes } from '../app/routes/AppRouter';
import '../i18n';

function renderRoute(path: string) {
    const router = createMemoryRouter(appRoutes, {
        initialEntries: [path],
    });

    return render(<RouterProvider router={router} />);
}

describe('Modern webapp smoke routes', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');
        vi.stubEnv('VITE_API_ORGANIZATION_ID', '7');
        vi.spyOn(globalThis, 'fetch').mockImplementation(
            () => new Promise(() => {}) as ReturnType<typeof fetch>,
        );
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it('loads app shell on home route', async () => {
        renderRoute('/');

        expect(await screen.findByRole('heading', { name: i18next.t('home.title') })).toBeInTheDocument();
        expect(screen.getByText('Prototype availability: Real.')).toBeInTheDocument();
        expect(screen.getByText('Simoona')).toBeInTheDocument();
        expect(screen.getByTestId('wall-data-source-summary')).toHaveTextContent(
            'Feed source: mock fixtures · Widgets source: mock fixtures',
        );
        expect(screen.getByLabelText('Feed stream')).toBeInTheDocument();
        expect(screen.getByLabelText('Wall widgets')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Kudos Feed' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Upcoming Events' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'User Info' })).toHaveAttribute('href', '/user-info');
        expect(screen.getByRole('link', { name: 'General Settings' })).toHaveAttribute(
            'href',
            '/settings/general',
        );
        expect(screen.getByRole('link', { name: 'Employees' })).toHaveAttribute('href', '/employees');
        expect(screen.getByRole('link', { name: 'My Profile' })).toHaveAttribute('href', '/profiles/me');
        expect(screen.getByRole('link', { name: 'Activity Feed' })).toHaveAttribute(
            'href',
            '/activities/feed',
        );
        expect(screen.getByRole('link', { name: 'Integrations' })).toHaveAttribute(
            'href',
            '/externals/integrations',
        );
        expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/events');
        expect(screen.getByRole('link', { name: 'Vacations' })).toHaveAttribute('href', '/vacations');
        expect(screen.getByRole('link', { name: 'Kudos' })).toHaveAttribute('href', '/kudos');
        expect(screen.getByRole('link', { name: 'Books' })).toHaveAttribute('href', '/books');
        expect(screen.getByRole('link', { name: 'Service Requests' })).toHaveAttribute(
            'href',
            '/service-requests',
        );
        expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
        expect(screen.getByRole('link', { name: 'Office Map' })).toHaveAttribute('href', '/office-map');
        expect(screen.getByRole('link', { name: 'Organizational Structure' })).toHaveAttribute(
            'href',
            '/organization/structure',
        );
        expect(screen.getByRole('link', { name: 'Committees' })).toHaveAttribute('href', '/committees');
    });

    it('keeps home route sections visible in demo mode without fatal render errors', async () => {
        renderRoute('/');

        expect(await screen.findByRole('heading', { name: i18next.t('home.title') })).toBeInTheDocument();
        expect(screen.getByTestId('wall-content-grid')).toBeInTheDocument();
        expect(screen.getByTestId('wall-feed-column')).toBeInTheDocument();
        expect(screen.getByTestId('wall-widgets-column')).toBeInTheDocument();
    });

    it('renders fallback state when api-backed real route cannot reach api', async () => {
        vi.restoreAllMocks();
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:5187'));

        renderRoute('/user-info');

        expect(await screen.findByRole('heading', { name: i18next.t('userInfo.title') })).toBeInTheDocument();
        expect(
            screen.getByText('User information is temporarily unavailable because the API is not reachable.'),
        ).toBeInTheDocument();
        expect(screen.getByText('Simoona')).toBeInTheDocument();
    });

    it('reaches user-info route', async () => {
        renderRoute('/user-info');
        expect(await screen.findByRole('heading', { name: i18next.t('userInfo.title') })).toBeInTheDocument();
    });

    it('reaches general-settings route', async () => {
        renderRoute('/settings/general');
        expect(await screen.findByRole('heading', { name: i18next.t('generalSettings.title') })).toBeInTheDocument();
    });

    it('reaches employee-directory route', async () => {
        renderRoute('/employees');
        expect(await screen.findByRole('heading', { name: i18next.t('employeeDirectory.title') })).toBeInTheDocument();
    });

    it('reaches my-profile route', async () => {
        renderRoute('/profiles/me');
        expect(await screen.findByRole('heading', { name: i18next.t('myProfile.title') })).toBeInTheDocument();
    });

    it('reaches placeholder prototype routes', async () => {
        const routes = [
            { path: '/activities/feed', heading: 'Activity Feed' },
            { path: '/recognition', heading: 'Recognition' },
            { path: '/events', heading: 'Events' },
            { path: '/vacations', heading: 'Vacations' },
            { path: '/kudos', heading: 'Kudos' },
            { path: '/books', heading: 'Books' },
            { path: '/service-requests', heading: 'Service Requests' },
            { path: '/teams', heading: 'Teams' },
            { path: '/projects', heading: 'Projects' },
            { path: '/office-map', heading: 'Office Map' },
            { path: '/organization/structure', heading: 'Organizational Structure' },
            { path: '/committees', heading: 'Committees' },
            { path: '/externals/integrations', heading: 'Integrations' },
        ];

        for (const route of routes) {
            const view = renderRoute(route.path);
            expect(await screen.findByRole('heading', { name: route.heading })).toBeInTheDocument();
            view.unmount();
        }
    });
});
