import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { appRoutes } from './AppRouter';
import '../../i18n';

describe('AppRouter', () => {
    it('renders health route', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: ['/health'],
        });

        render(<RouterProvider router={router} />);

        expect(await screen.findByRole('heading', { name: 'Health' })).toBeInTheDocument();
        expect(screen.getByText('Status: OK')).toBeInTheDocument();
    });
});
