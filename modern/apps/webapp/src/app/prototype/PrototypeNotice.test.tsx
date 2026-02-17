import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrototypeNotice } from './PrototypeNotice';

describe('PrototypeNotice', () => {
    it('renders real availability copy', () => {
        render(<PrototypeNotice mode="real" />);

        expect(screen.getByRole('status')).toHaveTextContent('Prototype availability: Real.');
        expect(screen.getByRole('status')).toHaveTextContent('backed by the modern API contract');
    });

    it('renders mock availability with reason', () => {
        render(<PrototypeNotice mode="mock" reason="Demo-only data source for this route." />);

        expect(screen.getByRole('status')).toHaveTextContent('Prototype availability: Mock.');
        expect(screen.getByRole('status')).toHaveTextContent('Demo-only data source for this route.');
    });

    it('renders disabled availability with reason', () => {
        render(<PrototypeNotice mode="disabled" reason="Out of scope until partner APIs are migrated." />);

        expect(screen.getByRole('status')).toHaveTextContent('Prototype availability: Disabled.');
        expect(screen.getByRole('status')).toHaveTextContent('Out of scope until partner APIs are migrated.');
    });
});
