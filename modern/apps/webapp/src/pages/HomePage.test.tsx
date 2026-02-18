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
        expect(screen.getAllByRole('button', { name: 'Reply' }).every((button) => button.hasAttribute('disabled'))).toBe(
            true,
        );
    });

    it('keeps compact post section ordering and separator-row structure', () => {
        render(<HomePage />);

        const postCards = screen.getAllByTestId('wall-post-card');
        expect(postCards).toHaveLength(2);
        const firstPostCard = postCards[0]!;
        const secondPostCard = postCards[1]!;
        const firstSections = Array.from(firstPostCard.querySelectorAll('[data-section]')).map((section) =>
            section.getAttribute('data-section'),
        );
        const secondSections = Array.from(secondPostCard.querySelectorAll('[data-section]')).map((section) =>
            section.getAttribute('data-section'),
        );

        expect(firstSections).toEqual(['wall-label', 'meta', 'body', 'media', 'reactions', 'actions', 'thread', 'comment']);
        expect(secondSections).toEqual(['wall-label', 'meta', 'body', 'media', 'reactions', 'actions', 'comment']);
        expect(firstPostCard.querySelectorAll('.wall-post-separator-row')).toHaveLength(3);
        expect(secondPostCard.querySelectorAll('.wall-post-separator-row')).toHaveLength(3);
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

    it('renders right-rail widgets with heading and list semantics', () => {
        render(<HomePage />);

        const widgetCards = screen.getAllByTestId('wall-widget-card');
        const widgetHeadings = screen.getAllByTestId('wall-widget-heading');
        const widgetLists = screen.getAllByTestId('wall-widget-list');

        expect(widgetCards).toHaveLength(4);
        expect(widgetHeadings).toHaveLength(4);
        expect(widgetLists).toHaveLength(4);
        expect(widgetHeadings.map((heading) => heading.tagName)).toEqual(['H2', 'H2', 'H2', 'H2']);
        expect(widgetLists.map((list) => list.tagName)).toEqual(['UL', 'UL', 'UL', 'UL']);
    });
});
