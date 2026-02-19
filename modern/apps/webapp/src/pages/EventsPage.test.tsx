import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EventsPage } from './EventsPage';

describe('EventsPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('renders legacy-like events layout with deterministic grouped content', async () => {
        render(<EventsPage />);

        expect(await screen.findByRole('heading', { name: 'Events' })).toBeInTheDocument();
        expect(screen.getByTestId('events-controls')).toBeInTheDocument();
        expect(screen.getByTestId('events-timeframe-select')).toHaveValue('all');
        expect(screen.getByTestId('events-office-select')).toHaveValue('all');
        expect(screen.getByTestId('events-type-select')).toHaveValue('all');
        expect(screen.getByTestId('events-sort-select')).toHaveValue('soonest');
        expect(screen.getByTestId('events-create-cta')).toBeDisabled();
        expect(screen.getByTestId('events-data-source-summary')).toHaveTextContent('Data source: mock fixtures');

        const upcomingSection = await screen.findByTestId('events-upcoming-success');
        expect(within(upcomingSection).getByText('Cross-team Coffee Chat')).toBeInTheDocument();

        const pastSection = await screen.findByTestId('events-past-success');
        expect(within(pastSection).getByText('Incident Playback Session')).toBeInTheDocument();

        expect(screen.getByTestId('events-widgets-success')).toBeInTheDocument();
        expect(screen.getAllByTestId('events-widget-card')).toHaveLength(3);
    });

    it('applies deterministic sorting and detail expansion', async () => {
        const user = userEvent.setup();

        render(<EventsPage />);

        const upcomingSection = await screen.findByTestId('events-upcoming-success');
        const firstTitleBefore = within(upcomingSection).getAllByRole('heading', { level: 3 })[0];
        expect(firstTitleBefore).toHaveTextContent('Cross-team Coffee Chat');

        await user.selectOptions(screen.getByTestId('events-sort-select'), 'latest');

        const upcomingAfterSort = await screen.findByTestId('events-upcoming-success');
        const firstTitleAfter = within(upcomingAfterSort).getAllByRole('heading', { level: 3 })[0];
        expect(firstTitleAfter).toHaveTextContent('Monthly All-hands');

        await user.click(screen.getByTestId('event-details-toggle-mock-allhands-march'));
        expect(screen.getByTestId('event-details-mock-allhands-march')).toBeInTheDocument();
        expect(screen.getByTestId('events-filter-summary')).toHaveTextContent('all, all, all, latest');
    });

    it('shows explicit empty and unavailable states for deterministic filter selections', async () => {
        const user = userEvent.setup();

        render(<EventsPage />);

        await screen.findByTestId('events-upcoming-success');

        await user.selectOptions(screen.getByTestId('events-office-select'), 'tallinn');
        expect(await screen.findByTestId('events-upcoming-empty')).toBeInTheDocument();
        expect(screen.getByTestId('events-past-empty')).toBeInTheDocument();

        await user.selectOptions(screen.getByTestId('events-type-select'), 'external');
        expect(await screen.findByTestId('events-upcoming-unavailable')).toBeInTheDocument();
        expect(screen.getByTestId('events-past-unavailable')).toBeInTheDocument();
        expect(screen.getByTestId('events-widgets-unavailable')).toBeInTheDocument();
    });
});
