import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KudosPage } from './KudosPage';

describe('KudosPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('renders kudos feed and summary panel with read-only CTA', async () => {
        render(<KudosPage />);

        expect(await screen.findByRole('heading', { name: 'Kudos' })).toBeInTheDocument();
        expect(screen.getByTestId('kudos-controls')).toBeInTheDocument();
        expect(screen.getByTestId('kudos-period-select')).toHaveValue('quarter-to-date');
        expect(screen.getByTestId('kudos-type-select')).toHaveValue('all');
        expect(screen.getByTestId('kudos-team-select')).toHaveValue('all');
        expect(screen.getByTestId('kudos-give-cta')).toBeDisabled();
        expect(screen.getByTestId('kudos-data-source-summary')).toHaveTextContent('Data source: mock fixtures');

        const feedSection = await screen.findByTestId('kudos-feed-success');
        expect(within(feedSection).getByText('Demo Moderator')).toBeInTheDocument();
        const firstFeedItem = within(feedSection).getAllByTestId('kudos-feed-item')[0]!;
        expect(within(firstFeedItem).getByText('Inga P.')).toBeInTheDocument();

        expect(screen.getByTestId('kudos-leaderboard-success')).toBeInTheDocument();
        expect(screen.getByTestId('kudos-distribution-success')).toBeInTheDocument();
    });

    it('applies deterministic period/type/team filters', async () => {
        const user = userEvent.setup();

        render(<KudosPage />);

        await screen.findByTestId('kudos-feed-success');

        await user.selectOptions(screen.getByTestId('kudos-period-select'), 'last-30-days');
        await user.selectOptions(screen.getByTestId('kudos-type-select'), 'teamwork');
        await user.selectOptions(screen.getByTestId('kudos-team-select'), 'engineering');

        const filteredFeed = await screen.findByTestId('kudos-feed-success');
        const feedItems = within(filteredFeed).getAllByTestId('kudos-feed-item');
        expect(feedItems).toHaveLength(1);
        expect(within(feedItems[0]!).getByText('Demo Moderator')).toBeInTheDocument();
        expect(within(feedItems[0]!).getByText('Inga P.')).toBeInTheDocument();
        expect(screen.getByTestId('kudos-filter-summary')).toHaveTextContent('last-30-days, teamwork, engineering');
    });

    it('shows explicit empty and unavailable states for deterministic selections', async () => {
        const user = userEvent.setup();

        render(<KudosPage />);

        await screen.findByTestId('kudos-feed-success');

        await user.selectOptions(screen.getByTestId('kudos-period-select'), 'last-30-days');
        await user.selectOptions(screen.getByTestId('kudos-team-select'), 'finance');
        expect(await screen.findByTestId('kudos-feed-empty')).toBeInTheDocument();
        expect(screen.getByTestId('kudos-leaderboard-empty')).toBeInTheDocument();
        expect(screen.getByTestId('kudos-distribution-empty')).toBeInTheDocument();

        await user.selectOptions(screen.getByTestId('kudos-type-select'), 'external');
        expect(await screen.findByTestId('kudos-feed-unavailable')).toBeInTheDocument();
        expect(screen.getByTestId('kudos-leaderboard-unavailable')).toBeInTheDocument();
        expect(screen.getByTestId('kudos-distribution-unavailable')).toBeInTheDocument();
    });
});
