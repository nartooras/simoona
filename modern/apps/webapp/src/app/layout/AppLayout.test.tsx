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
        expect(screen.getByRole('heading', { name: 'Workspace' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Account' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'System' })).toBeInTheDocument();
        expect(screen.getByText('Layout content')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'User Info' })).toHaveAttribute('href', '/user-info');
        expect(screen.getByRole('link', { name: 'General Settings' })).toHaveAttribute(
            'href',
            '/settings/general',
        );
        expect(screen.getByRole('link', { name: 'Employees' })).toHaveAttribute('href', '/employees');
        expect(screen.getByRole('link', { name: 'My Profile' })).toHaveAttribute('href', '/profiles/me');
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
