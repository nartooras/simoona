import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppLayout } from './AppLayout';

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
        expect(screen.getByRole('heading', { name: 'Activities' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Company' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Externals' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'System' })).toBeInTheDocument();
        expect(screen.getByText('Prototype Shell')).toBeInTheDocument();
        expect(screen.getByText('Demo Org')).toBeInTheDocument();
        expect(screen.getByText('Layout content')).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Activity Feed' })).toHaveAttribute(
            'href',
            '/activities/feed',
        );
        expect(screen.getByRole('link', { name: 'Recognition' })).toHaveAttribute('href', '/recognition');
        expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/events');
        expect(screen.getByRole('link', { name: 'Vacations' })).toHaveAttribute('href', '/vacations');
        expect(screen.getByRole('link', { name: 'Kudos' })).toHaveAttribute('href', '/kudos');
        expect(screen.getByRole('link', { name: 'Books' })).toHaveAttribute('href', '/books');
        expect(screen.getByRole('link', { name: 'Service Requests' })).toHaveAttribute(
            'href',
            '/service-requests',
        );
        expect(screen.getByRole('link', { name: 'User Info' })).toHaveAttribute('href', '/user-info');
        expect(screen.getByRole('link', { name: 'General Settings' })).toHaveAttribute(
            'href',
            '/settings/general',
        );
        expect(screen.getByRole('link', { name: 'Employees' })).toHaveAttribute('href', '/employees');
        expect(screen.getByRole('link', { name: 'My Profile' })).toHaveAttribute('href', '/profiles/me');
        expect(screen.getByRole('link', { name: 'Teams' })).toHaveAttribute('href', '/teams');
        expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
        expect(screen.getByRole('link', { name: 'Office Map' })).toHaveAttribute('href', '/office-map');
        expect(screen.getByRole('link', { name: 'Organizational Structure' })).toHaveAttribute(
            'href',
            '/organization/structure',
        );
        expect(screen.getByRole('link', { name: 'Committees' })).toHaveAttribute('href', '/committees');
        expect(screen.getByRole('link', { name: 'Integrations' })).toHaveAttribute(
            'href',
            '/externals/integrations',
        );
        expect(screen.getByRole('link', { name: 'Health' })).toHaveAttribute('href', '/health');
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
