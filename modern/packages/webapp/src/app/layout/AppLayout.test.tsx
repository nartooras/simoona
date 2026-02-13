import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
    it('renders header and content', () => {
        render(
            <AppLayout>
                <div>Layout content</div>
            </AppLayout>,
        );

        expect(screen.getByText('Simoona Modern Webapp')).toBeInTheDocument();
        expect(screen.getByText('Layout content')).toBeInTheDocument();
    });
});
