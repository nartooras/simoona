import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import '../i18n';
import { HomePage } from './HomePage';

describe('HomePage', () => {
    it('renders wall three-column shell content with feed and widgets', async () => {
        render(<HomePage />);

        expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument();
        expect(screen.getByLabelText('Feed stream')).toBeInTheDocument();
        expect(screen.getByLabelText('Wall widgets')).toBeInTheDocument();
        expect(screen.getByText('Company Wall')).toBeInTheDocument();
        expect(screen.getByText('Engineering Wall')).toBeInTheDocument();
        expect(screen.getByText('Product Wall')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Kudos Feed' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Upcoming Events' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Rankings' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Birthdays' })).toBeInTheDocument();
        expect(screen.getAllByTestId('wall-widget-card')).toHaveLength(4);
        expect(screen.getAllByTestId('wall-widget-row')).toHaveLength(11);
    });

    it('simulates like and unlike toggles without persistence', async () => {
        const user = userEvent.setup();

        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();

        const firstPost = screen.getAllByTestId('wall-post-card')[0]!;
        expect(firstPost).toHaveTextContent('12 likes · 2 replies');

        const unlikeButton = within(firstPost).getByRole('button', { name: 'Unlike' });
        await user.click(unlikeButton);
        expect(within(firstPost).getByRole('button', { name: 'Like' })).toBeInTheDocument();
        expect(firstPost).toHaveTextContent('11 likes · 2 replies');

        await user.click(within(firstPost).getByRole('button', { name: 'Like' }));
        expect(within(firstPost).getByRole('button', { name: 'Unlike' })).toBeInTheDocument();
        expect(firstPost).toHaveTextContent('12 likes · 2 replies');
    });

    it('supports reply expand and collapse behavior with simulated composer', async () => {
        const user = userEvent.setup();

        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();
        expect(screen.queryAllByTestId('wall-post-comment-row')).toHaveLength(0);

        const firstReplyToggle = screen.getAllByRole('button', { name: 'Reply' })[0]!;
        await user.click(firstReplyToggle);
        expect(screen.getByRole('button', { name: 'Collapse reply' })).toBeInTheDocument();
        expect(screen.getByLabelText('Prototype comment input')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Collapse reply' }));
        expect(screen.queryByLabelText('Prototype comment input')).not.toBeInTheDocument();
    });

    it('supports show and hide replies link behavior', async () => {
        const user = userEvent.setup();

        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();
        expect(screen.queryByTestId('wall-post-thread')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Show replies (2)' }));
        expect(screen.getByRole('button', { name: 'Hide replies' })).toBeInTheDocument();
        expect(screen.getByTestId('wall-post-thread')).toBeInTheDocument();
        expect(screen.getByText('Greta Simonyte')).toBeInTheDocument();
        expect(screen.getByText('Paulius Dainys')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Hide replies' }));
        expect(screen.queryByText('Greta Simonyte')).not.toBeInTheDocument();
    });

    it('renders feed and right-rail semantics for cards, replies, and widget lists', async () => {
        const user = userEvent.setup();

        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();

        const postCards = screen.getAllByTestId('wall-post-card');
        expect(postCards).toHaveLength(3);
        expect(screen.getAllByTestId('wall-post-reaction-line')).toHaveLength(3);
        expect(screen.getAllByTestId('wall-post-action-row')).toHaveLength(3);

        await user.click(screen.getByRole('button', { name: 'Show replies (2)' }));
        expect(screen.getByTestId('wall-post-thread')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /Show replies|Hide replies/ })).toHaveLength(2);

        const widgetHeadings = screen.getAllByTestId('wall-widget-heading');
        const widgetLists = screen.getAllByTestId('wall-widget-list');

        expect(widgetHeadings).toHaveLength(4);
        expect(widgetLists).toHaveLength(4);
        expect(widgetHeadings.map((heading) => heading.tagName)).toEqual(['H2', 'H2', 'H2', 'H2']);
        expect(widgetLists.map((list) => list.tagName)).toEqual(['UL', 'UL', 'UL', 'UL']);
    });

    it('renders loading states before adapter payload resolves', () => {
        render(<HomePage />);

        expect(screen.getByTestId('wall-feed-loading')).toBeInTheDocument();
        expect(screen.getByTestId('wall-widget-loading')).toBeInTheDocument();
    });
});
