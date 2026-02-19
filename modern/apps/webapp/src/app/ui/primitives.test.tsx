import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardChrome, InfoMetaRow, ListRow, SectionHeader, StatusBadge } from './primitives';

describe('UI primitives', () => {
    it('renders section header with title, subtitle, and meta text', () => {
        render(
            <SectionHeader
                meta="Feed source: real API"
                subtitle="Core wall stream with compact parity-ready feed and right-rail density."
                title="Home"
                titleAs="h1"
            />,
        );

        expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
        expect(
            screen.getByText('Core wall stream with compact parity-ready feed and right-rail density.'),
        ).toBeInTheDocument();
        expect(screen.getByText('Feed source: real API')).toBeInTheDocument();
    });

    it('renders status badge with mode semantics', () => {
        render(<StatusBadge mode="mock" />);

        const badge = screen.getByText('Mock');
        expect(badge).toHaveClass('ui-status-badge', 'ui-status-badge--mock');
        expect(badge).toHaveAttribute('data-status-mode', 'mock');
    });

    it('renders info/meta row and list row separator semantics', () => {
        render(
            <ul>
                <ListRow data-testid="row-1">
                    <InfoMetaRow primary="Ada Lovelace" secondary="5 minutes ago" />
                </ListRow>
                <ListRow data-testid="row-2" withSeparator={false}>
                    <InfoMetaRow primary="No separator row" />
                </ListRow>
            </ul>,
        );

        expect(screen.getByTestId('row-1')).toHaveClass('ui-list-row--separator');
        expect(screen.getByTestId('row-2')).not.toHaveClass('ui-list-row--separator');
        expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
        expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
    });

    it('renders card chrome wrapper with tone', () => {
        render(
            <CardChrome data-testid="card" tone="warning">
                Card content
            </CardChrome>,
        );

        expect(screen.getByTestId('card')).toHaveClass('ui-card-chrome', 'ui-card-chrome--warning');
        expect(screen.getByText('Card content')).toBeInTheDocument();
    });
});
