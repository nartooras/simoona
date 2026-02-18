import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../i18n';
import { HomePage } from './HomePage';

describe('HomePage', () => {
    it('renders wall three-column shell content with feed and widgets', () => {
        render(<HomePage />);

        expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
        expect(screen.getByLabelText('Feed stream')).toBeInTheDocument();
        expect(screen.getByLabelText('Wall widgets')).toBeInTheDocument();
        expect(screen.getByText('Company Wall')).toBeInTheDocument();
        expect(screen.getByText('Engineering Wall')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Kudos Feed' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Upcoming Events' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Rankings' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Birthdays' })).toBeInTheDocument();
    });

    it('keeps key feed content visible for mobile fallback stacking', () => {
        render(<HomePage />);

        expect(screen.getByTestId('wall-content-grid')).toBeInTheDocument();
        expect(screen.getByText('Milda Vaitke')).toBeInTheDocument();
        expect(screen.getByText('Tomas Petrauskas')).toBeInTheDocument();
        expect(screen.getAllByText('Like')).toHaveLength(2);
        expect(screen.getAllByPlaceholderText('Commenting is disabled in prototype mode')).toHaveLength(2);
    });
});
