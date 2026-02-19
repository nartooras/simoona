import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WallPage } from './WallPage';

function renderWallPage(wallId: Parameters<typeof WallPage>[0]['wallId'], routeLabel: string) {
    return render(
        <MemoryRouter>
            <WallPage routeLabel={routeLabel} wallId={wallId} />
        </MemoryRouter>,
    );
}

describe('WallPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it('renders official wall route layout with deterministic controls and context links', async () => {
        renderWallPage('company-wall', 'Official wall');

        expect(await screen.findByRole('heading', { name: 'Official wall' })).toBeInTheDocument();
        expect(screen.getByTestId('wall-context-controls')).toBeInTheDocument();
        expect(screen.getByTestId('wall-sort-select')).toHaveValue('latest');
        expect(screen.getByTestId('wall-category-select')).toHaveValue('all');
        expect(screen.getByTestId('wall-data-source-summary')).toHaveTextContent(
            'Feed source: mock fixtures · Widgets source: mock fixtures',
        );
        expect(screen.getByText('Demo Moderator')).toBeInTheDocument();
        expect(screen.getByLabelText('Wall widgets')).toBeInTheDocument();
        expect(screen.getByTestId('wall-context-link-all')).toHaveAttribute('href', '/walls');
        expect(screen.getByTestId('wall-context-link-company-wall')).toHaveAttribute('data-selected', 'true');
        expect(screen.getByTestId('wall-context-link-engineering-wall')).toHaveAttribute('href', '/walls/engineering-wall');
    });

    it('renders subscribed wall dataset deterministically for selected context', async () => {
        renderWallPage('engineering-wall', 'Engineering Wall');

        expect(await screen.findByRole('heading', { name: 'Engineering Wall' })).toBeInTheDocument();
        expect(screen.getByText('Build Bot')).toBeInTheDocument();
        expect(screen.queryByText('Demo Moderator')).not.toBeInTheDocument();
    });

    it('applies deterministic top sort and topic filter on selected wall', async () => {
        const user = userEvent.setup();

        renderWallPage('engineering-wall', 'Engineering Wall');

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

    it('shows explicit empty state for subscribed wall without posts', async () => {
        renderWallPage('newcomers-wall', 'Newcomers Wall');

        expect(await screen.findByRole('heading', { name: 'Newcomers Wall' })).toBeInTheDocument();
        expect(await screen.findByTestId('wall-feed-empty')).toBeInTheDocument();
        expect(screen.getByText(/No posts are available in Newcomers Wall/i)).toBeInTheDocument();
    });
});
