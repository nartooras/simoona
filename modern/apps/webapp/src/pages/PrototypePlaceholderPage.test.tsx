import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrototypePlaceholderPage } from './PrototypePlaceholderPage';

describe('PrototypePlaceholderPage', () => {
    it('renders standardized prototype sections and simulated actions', () => {
        render(
            <PrototypePlaceholderPage
                actions={[
                    {
                        label: 'Create Item',
                        explanation: 'Disabled in prototype mode.',
                    },
                ]}
                availableNow={['Navigation visibility']}
                cards={[{ title: 'Coverage', value: 'Route is available in prototype mode.' }]}
                dataSource="mock"
                plannedNextWave={['Real API contracts']}
                summary="Static preview with safe interactions."
                title="Placeholder Route"
                unavailableInPrototype={['Write actions']}
            />,
        );

        expect(screen.getByRole('heading', { name: 'Placeholder Route' })).toBeInTheDocument();
        expect(screen.getByText('Data source: Mock fixtures.')).toBeInTheDocument();
        expect(screen.getByText('Actions shown below are intentionally read-only in prototype mode.')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Available now' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Unavailable in prototype' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Planned next wave' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Item' })).toBeDisabled();
        expect(screen.getByText('Disabled in prototype mode.')).toBeInTheDocument();
    });
});
