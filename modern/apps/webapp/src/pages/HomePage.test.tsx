import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import '../i18n';
import { HomePage } from './HomePage';

describe('HomePage', () => {
    it('renders wall three-column shell content with feed and widgets', async () => {
        render(<HomePage />);

        expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument();
        expect(screen.getByTestId('wall-data-source-summary')).toHaveTextContent(
            'Feed source: real API · Widgets source: real API',
        );
        expect(screen.getByLabelText('Feed stream')).toBeInTheDocument();
        expect(screen.getByLabelText('Wall widgets')).toBeInTheDocument();
        expect(screen.getAllByText('Company Wall').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Engineering Wall').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Product Wall').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByRole('heading', { name: 'Kudos Feed' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Upcoming Events' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Rankings' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Birthdays' })).toBeInTheDocument();
        expect(screen.getAllByTestId('wall-widget-card')).toHaveLength(4);
        expect(screen.getAllByTestId('wall-widget-row')).toHaveLength(11);
        expect(screen.getAllByTestId('wall-widget-heading').map((heading) => heading.textContent?.trim())).toEqual([
            'Kudos Feed',
            'Upcoming Events',
            'Rankings',
            'Birthdays',
        ]);
        expect(screen.getAllByTestId('wall-widget-meta').map((meta) => meta.textContent?.trim())).toEqual([
            '3 items',
            '3 items',
            '3 items',
            '2 items',
        ]);
    });

    it('simulates like and unlike toggles without persistence', async () => {
        const user = userEvent.setup();

        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();

        const firstPost = screen.getAllByTestId('wall-post-card')[0]!;
        expect(firstPost).toHaveTextContent('12 people like this · 3 comments');

        const unlikeButton = within(firstPost).getByRole('button', { name: 'Unlike' });
        expect(unlikeButton).toHaveAttribute('aria-pressed', 'true');
        await user.click(unlikeButton);
        const likeButton = within(firstPost).getByRole('button', { name: 'Like' });
        expect(likeButton).toBeInTheDocument();
        expect(likeButton).toHaveAttribute('aria-pressed', 'false');
        expect(firstPost).toHaveTextContent('11 people like this · 3 comments');

        await user.click(likeButton);
        const unlikeButtonAgain = within(firstPost).getByRole('button', { name: 'Unlike' });
        expect(unlikeButtonAgain).toBeInTheDocument();
        expect(unlikeButtonAgain).toHaveAttribute('aria-pressed', 'true');
        expect(firstPost).toHaveTextContent('12 people like this · 3 comments');
    });

    it('supports reply expand and collapse behavior with simulated composer', async () => {
        const user = userEvent.setup();

        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();
        expect(screen.queryAllByTestId('wall-post-comment-row')).toHaveLength(0);

        const firstReplyToggle = screen.getAllByRole('button', { name: 'Reply' })[0]!;
        await user.click(firstReplyToggle);
        expect(screen.getByRole('button', { name: 'Collapse reply' })).toBeInTheDocument();
        const commentRow = screen.getByTestId('wall-post-comment-row');
        expect(within(commentRow).getByLabelText('Prototype comment input')).toBeInTheDocument();
        expect(within(commentRow).getByRole('button', { name: 'Reply' })).toBeDisabled();

        await user.click(screen.getByRole('button', { name: 'Collapse reply' }));
        expect(screen.queryByLabelText('Prototype comment input')).not.toBeInTheDocument();
    });

    it('supports show and hide replies link behavior', async () => {
        const user = userEvent.setup();

        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();
        expect(screen.queryByTestId('wall-post-thread')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Show all replies (3)' }));
        expect(screen.getByRole('button', { name: 'Collapse replies' })).toBeInTheDocument();
        const thread = screen.getByTestId('wall-post-thread');
        expect(thread).toBeInTheDocument();
        expect(screen.getByText('Greta Simonyte')).toBeInTheDocument();
        expect(screen.getByText('Paulius Dainys')).toBeInTheDocument();
        expect(thread.querySelectorAll('.wall-avatar--reply')).toHaveLength(3);

        await user.click(screen.getByRole('button', { name: 'Collapse replies' }));
        expect(screen.queryByText('Greta Simonyte')).not.toBeInTheDocument();
    });

    it('renders feed and right-rail semantics for cards, replies, and widget lists', async () => {
        const user = userEvent.setup();

        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();

        const postCards = screen.getAllByTestId('wall-post-card');
        expect(postCards).toHaveLength(5);
        expect(screen.getAllByTestId('wall-post-reaction-line')).toHaveLength(5);
        expect(screen.getAllByTestId('wall-post-action-row')).toHaveLength(5);

        await user.click(screen.getByRole('button', { name: 'Show all replies (3)' }));
        expect(screen.getByTestId('wall-post-thread')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /Show all replies|Show reply|Collapse replies/ })).toHaveLength(3);

        const widgetHeadings = screen.getAllByTestId('wall-widget-heading');
        const widgetLists = screen.getAllByTestId('wall-widget-list');
        const widgetRows = screen.getAllByTestId('wall-widget-row');

        expect(widgetHeadings).toHaveLength(4);
        expect(widgetLists).toHaveLength(4);
        expect(widgetRows).toHaveLength(11);
        expect(widgetHeadings.map((heading) => heading.tagName)).toEqual(['H2', 'H2', 'H2', 'H2']);
        expect(widgetLists.map((list) => list.tagName)).toEqual(['UL', 'UL', 'UL', 'UL']);

        const firstWidgetRow = widgetRows[0]!;
        expect(within(firstWidgetRow).getByTestId('wall-widget-row-title')).toHaveTextContent('Egle thanked QA Team');
        expect(within(firstWidgetRow).getByTestId('wall-widget-row-meta')).toHaveTextContent(
            'Regression coverage for release candidate',
        );
        expect(within(firstWidgetRow).getByTestId('wall-widget-row-subtext')).toHaveTextContent('2 hours ago');
    });

    it('preserves compact micro-detail hooks for muted metadata and dividers', async () => {
        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();

        const firstPost = screen.getAllByTestId('wall-post-card')[0]!;
        expect(firstPost.querySelector('.wall-post-timestamp.wall-meta-muted')).toBeInTheDocument();
        expect(firstPost.querySelector('.wall-post-reaction-line.wall-meta-muted')).toBeInTheDocument();

        const firstWidgetRow = screen.getAllByTestId('wall-widget-row')[0]!;
        expect(firstWidgetRow.querySelector('.wall-widget-row-meta.wall-meta-muted')).toBeInTheDocument();
        expect(firstWidgetRow.querySelector('.wall-widget-row-subtext.wall-meta-muted')).toBeInTheDocument();
    });

    it('renders varied post structures for media and nested replies', async () => {
        const user = userEvent.setup();

        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();
        expect(screen.getAllByTestId('wall-post-media-section')).toHaveLength(5);
        expect(screen.getAllByTestId('wall-post-media-none')).toHaveLength(2);

        await user.click(screen.getByRole('button', { name: 'Show all replies (3)' }));
        const nestedReplies = screen.getAllByTestId('wall-post-reply').filter((reply) => reply.getAttribute('data-depth') === '1');
        expect(nestedReplies).toHaveLength(1);
    });

    it('keeps stable semantic hooks for key card sections', async () => {
        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();
        expect(screen.getAllByTestId('wall-post-meta-line')).toHaveLength(5);
        expect(screen.getAllByTestId('wall-post-body')).toHaveLength(5);
        expect(screen.getAllByTestId('wall-post-media-section')).toHaveLength(5);
        expect(screen.getAllByTestId('wall-post-action-row')).toHaveLength(5);
        expect(screen.getAllByTestId('wall-post-reaction-line')).toHaveLength(5);
    });

    it('keeps post card sections in legacy-like top-to-bottom order', async () => {
        render(<HomePage />);

        expect(await screen.findByText('Milda Vaitke')).toBeInTheDocument();
        const firstPost = screen.getAllByTestId('wall-post-card')[0]!;
        const directSections = Array.from(firstPost.querySelectorAll(':scope > [data-section]')).map((node) =>
            node.getAttribute('data-section'),
        );

        expect(directSections).toEqual(['wall-title', 'meta', 'body', 'media', 'reactions', 'actions']);
        expect(within(firstPost).getByLabelText('Wall post actions')).toBeInTheDocument();
        expect(within(firstPost).getByLabelText('Post reactions')).toBeInTheDocument();
    });

    it('renders loading states before adapter payload resolves', () => {
        render(<HomePage />);

        expect(screen.getByTestId('wall-feed-loading')).toBeInTheDocument();
        expect(screen.getByTestId('wall-widget-loading')).toBeInTheDocument();
    });
});
