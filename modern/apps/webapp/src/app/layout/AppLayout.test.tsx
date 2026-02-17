import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
    it('renders header and content', () => {
        render(
            <MemoryRouter>
                <AppLayout>
                    <div>Layout content</div>
                </AppLayout>
            </MemoryRouter>,
        );

        expect(screen.getByText('Simoona Modern Webapp')).toBeInTheDocument();
        expect(screen.getByText('Layout content')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'User Info' })).toHaveAttribute('href', '/user-info');
        expect(screen.getByRole('link', { name: 'General Settings' })).toHaveAttribute(
            'href',
            '/settings/general',
        );
        expect(screen.getByRole('link', { name: 'Employees' })).toHaveAttribute('href', '/employees');
        expect(screen.getByRole('link', { name: 'My Profile' })).toHaveAttribute('href', '/profiles/me');
    });
});
