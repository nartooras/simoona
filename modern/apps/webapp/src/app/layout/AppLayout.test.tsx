import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppLayout } from './AppLayout';
import { navigationGroups } from '../routes/navigation';

describe('AppLayout', () => {
    it('renders header and grouped navigation content', () => {
        render(
            <MemoryRouter>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        expect(screen.getByText('Simoona')).toBeInTheDocument();
        expect(screen.getByRole('searchbox', { name: 'Global search' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Quick Links' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Messages' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
        expect(screen.getByText('Demo User')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Walls' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Activities' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Company' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Externals' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'System' })).toBeInTheDocument();
        expect(screen.getByText('Layout content')).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
    });

    it('renders full left rail taxonomy in legacy order', () => {
        const { container } = render(
            <MemoryRouter>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
        const sections = Array.from(nav.querySelectorAll('.app-nav-group'));
        expect(sections.map((section) => section.getAttribute('data-group'))).toEqual([
            'walls',
            'activities',
            'company',
            'externals',
            'system',
        ]);

        const expectedOrder = {
            walls: ['Home', 'Activity Feed', 'Recognition'],
            activities: ['Events', 'Kudos', 'Service Requests', 'Books', 'Vacations'],
            company: [
                'Office Map',
                'Organizational Structure',
                'Employees',
                'Projects',
                'Committees',
                'Teams',
                'User Info',
                'General Settings',
                'My Profile',
            ],
            externals: ['Integrations'],
            system: ['Health'],
        };

        for (const section of sections) {
            const groupKey = section.getAttribute('data-group') as keyof typeof expectedOrder;
            const linkLabels = Array.from(section.querySelectorAll('.nav-item-label')).map((label) => label.textContent?.trim());
            expect(linkLabels).toEqual(expectedOrder[groupKey]);
        }

        const navRoutes = navigationGroups.flatMap((group) => group.items.map((item) => item.to));
        const renderedRoutes = Array.from(container.querySelectorAll('.app-nav-group a')).map((anchor) =>
            anchor.getAttribute('href'),
        );
        expect(renderedRoutes).toEqual(navRoutes);
    });

    it('keeps deterministic shell regions and grouped navigation density', () => {
        const { container } = render(
            <MemoryRouter>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        expect(container.querySelector('[data-shell-geometry="wave2b"]')).not.toBeNull();
        expect(container.querySelector('[data-shell-fidelity="wave2b-topbar-leftnav"]')).not.toBeNull();
        expect(screen.getByTestId('app-header')).toBeInTheDocument();
        expect(screen.getByTestId('app-layout')).toBeInTheDocument();
        expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('app-content')).toBeInTheDocument();

        const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
        const navSections = nav.querySelectorAll('.app-nav-group');
        expect(navSections).toHaveLength(5);

        const navRows = nav.querySelectorAll('li');
        expect(navRows).toHaveLength(19);

        const availabilityBadges = nav.querySelectorAll('.nav-availability');
        expect(availabilityBadges).toHaveLength(19);
    });

    it('supports group expand and collapse', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        const activitiesToggle = screen.getByTestId('nav-group-toggle-activities');
        expect(activitiesToggle).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('link', { name: 'Events' })).toBeInTheDocument();

        await user.click(activitiesToggle);
        expect(activitiesToggle).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('link', { name: 'Events' })).not.toBeInTheDocument();

        await user.click(activitiesToggle);
        expect(activitiesToggle).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('link', { name: 'Events' })).toBeInTheDocument();
    });

    it('highlights active route link', () => {
        render(
            <MemoryRouter initialEntries={['/events']}>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        expect(screen.getByRole('link', { name: 'Events' })).toHaveClass('active');
        expect(screen.getByRole('link', { name: 'Vacations' })).not.toHaveClass('active');
    });

    it('keeps topbar and left rail geometry semantics for wave 2b parity', () => {
        const { container } = render(
            <MemoryRouter>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        expect(container.querySelector('[data-shell-taxonomy="wave2b-left-rail-taxonomy"]')).not.toBeNull();
        expect(container.querySelector('.topbar-height-legacy-44')).not.toBeNull();
        expect(container.querySelector('.topbar-geometry-wave2b')).not.toBeNull();
        expect(container.querySelector('[data-topbar-controls="legacy-hierarchy-v3a"]')).not.toBeNull();
        expect(screen.getByTestId('app-sidebar')).toHaveAttribute('data-left-rail-width', 'legacy-232');
        expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toHaveAttribute(
            'data-left-rail-density',
            'legacy-compact-wave2b',
        );
        expect(screen.getByRole('searchbox', { name: 'Global search' })).toHaveClass('topbar-search-input');
        expect(screen.getByRole('button', { name: 'Quick Links' })).toHaveClass('topbar-action');
        expect(screen.getByRole('button', { name: 'Notifications' })).toHaveClass('topbar-action--icon-only');
        expect(screen.getByRole('button', { name: 'Messages' })).toHaveClass('topbar-action--icon-only');
        expect(screen.getByRole('button', { name: 'Demo User' })).toHaveClass('topbar-action--user');
    });

    it('keeps stable header control ordering semantics', () => {
        render(
            <MemoryRouter>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        const controls = Array.from(screen.getByTestId('topbar-controls').querySelectorAll('[data-header-control]')).map((element) =>
            element.getAttribute('data-header-control'),
        );
        expect(controls).toEqual(['quick-links', 'messages', 'notifications', 'user-panel']);
    });

    it('tracks search focus state and keeps semantic search affordances', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        const search = screen.getByRole('searchbox', { name: 'Global search' });
        const searchContainer = search.closest('.app-header-search');
        expect(searchContainer).not.toBeNull();
        expect(searchContainer).toHaveAttribute('data-search-focus', 'false');
        expect(search).toHaveAttribute('placeholder', 'Search');
        expect(searchContainer?.querySelector('.topbar-search-icon')).not.toBeNull();

        await user.click(search);
        expect(searchContainer).toHaveAttribute('data-search-focus', 'true');

        await user.tab();
        expect(searchContainer).toHaveAttribute('data-search-focus', 'false');
    });

    it('renders user panel semantics with avatar and caret affordance', () => {
        render(
            <MemoryRouter>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        const userPanel = screen.getByRole('button', { name: 'Demo User' });
        expect(userPanel.querySelector('.header-user-avatar')).not.toBeNull();
        expect(userPanel.querySelector('.header-user-name')).not.toBeNull();
        expect(userPanel.querySelector('.header-user-chevron')).not.toBeNull();
    });

    it('toggles mobile navigation state', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <MemoryRouter>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        const toggle = within(container).getByRole('button', {
            name: 'Toggle navigation',
        });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');

        await user.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });
});
