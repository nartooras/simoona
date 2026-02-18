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
        expect(screen.getAllByTestId('wall-widget-card')).toHaveLength(4);
        expect(screen.getAllByTestId('wall-widget-row')).toHaveLength(10);
    });

    it('renders feed card anatomy sections with read-only interaction affordances', () => {
        render(<HomePage />);

        expect(screen.getByTestId('wall-content-grid')).toBeInTheDocument();
        expect(screen.getByText('Milda Vaitke')).toBeInTheDocument();
        expect(screen.getByText('Tomas Petrauskas')).toBeInTheDocument();
        expect(screen.getAllByTestId('wall-post-reaction-line')).toHaveLength(2);
        expect(screen.getAllByTestId('wall-post-action-row')).toHaveLength(2);
        expect(screen.getAllByRole('button', { name: 'Reply' })).toHaveLength(2);
        expect(screen.getByRole('button', { name: 'Unlike' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
        expect(screen.getAllByTestId('wall-post-comment-row')).toHaveLength(2);
        expect(screen.getAllByLabelText('Prototype comment input')).toHaveLength(2);
    });

    it('shows a realistic read-only thread under at least one feed card', () => {
        render(<HomePage />);

        expect(screen.getAllByTestId('wall-post-thread')).toHaveLength(1);
        expect(screen.getByText('Greta Simonyte')).toBeInTheDocument();
        expect(screen.getByText('Paulius Dainys')).toBeInTheDocument();
        expect(
            screen.getByText('Reviewed. Auth migration and directory pagination should stay in this sprint scope.'),
        ).toBeInTheDocument();
    });
});
