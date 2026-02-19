import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WallPage } from './WallPage';

describe('WallPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it('renders dedicated wall route layout with selector and filters', async () => {
        render(<WallPage />);

        expect(await screen.findByRole('heading', { name: 'Wall' })).toBeInTheDocument();
        expect(screen.getByTestId('wall-context-controls')).toBeInTheDocument();
        expect(screen.getByTestId('wall-context-select')).toHaveValue('company-wall');
        expect(screen.getByTestId('wall-sort-select')).toHaveValue('latest');
        expect(screen.getByTestId('wall-category-select')).toHaveValue('all');
        expect(screen.getByTestId('wall-data-source-summary')).toHaveTextContent(
            'Feed source: mock fixtures · Widgets source: mock fixtures',
        );
        expect(screen.getByText('Demo Moderator')).toBeInTheDocument();
        expect(screen.getByLabelText('Wall widgets')).toBeInTheDocument();
    });

    it('switches wall contexts deterministically across distinct datasets', async () => {
        const user = userEvent.setup();

        render(<WallPage />);

        expect(await screen.findByText('Demo Moderator')).toBeInTheDocument();

        await user.selectOptions(screen.getByTestId('wall-context-select'), 'engineering-wall');
        expect(await screen.findByText('Build Bot')).toBeInTheDocument();
        expect(screen.queryByText('Demo Moderator')).not.toBeInTheDocument();

        await user.click(screen.getByTestId('wall-context-chip-culture-wall'));
        expect(await screen.findByText('People Ops')).toBeInTheDocument();
        expect(screen.queryByText('Build Bot')).not.toBeInTheDocument();
    });

    it('applies deterministic top sort and topic filter on selected wall', async () => {
        const user = userEvent.setup();

        render(<WallPage />);

        await screen.findByText('Demo Moderator');
        await user.selectOptions(screen.getByTestId('wall-context-select'), 'engineering-wall');
        expect(await screen.findByText('Build Bot')).toBeInTheDocument();

        await user.selectOptions(screen.getByTestId('wall-sort-select'), 'top');
        expect(await screen.findByText('Feature Guard')).toBeInTheDocument();

        const firstPostAfterTopSort = screen.getAllByTestId('wall-post-card')[0]!;
        expect(within(firstPostAfterTopSort).getByText('Feature Guard')).toBeInTheDocument();

        await user.selectOptions(screen.getByTestId('wall-category-select'), 'operations');
        expect(await screen.findByText('Build Bot')).toBeInTheDocument();
        expect(screen.queryByText('Feature Guard')).not.toBeInTheDocument();
        expect(screen.getAllByTestId('wall-post-card')).toHaveLength(1);
        expect(screen.getByTestId('wall-filter-summary')).toHaveTextContent('top sort, operations topic');
    });

    it('shows explicit empty and unavailable states for wall-specific contexts', async () => {
        const user = userEvent.setup();

        render(<WallPage />);

        await screen.findByText('Demo Moderator');

        await user.selectOptions(screen.getByTestId('wall-context-select'), 'newcomers-wall');
        expect(await screen.findByTestId('wall-feed-empty')).toBeInTheDocument();
        expect(screen.getByText(/No posts are available in Newcomers Wall/i)).toBeInTheDocument();

        await user.selectOptions(screen.getByTestId('wall-context-select'), 'incident-wall');
        expect(await screen.findByTestId('wall-feed-unavailable')).toBeInTheDocument();
        expect(screen.getByTestId('wall-widget-unavailable')).toBeInTheDocument();
        expect(screen.getAllByText(/Incident wall data is unavailable/i)).toHaveLength(2);
    });
});
