import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appRoutes } from '../app/routes/AppRouter';
import '../i18n';
import { shellVisualBaselineSpec } from './ShellVisualBaseline.scaffold';

describe('Shell geometry baseline scaffold', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_ORGANIZATION_ID', '7');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('keeps deterministic shell structure for Wave 1A parity', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: [shellVisualBaselineSpec.route],
        });

        render(<RouterProvider router={router} />);

        for (const selector of shellVisualBaselineSpec.selectors) {
            expect(document.querySelector(selector)).not.toBeNull();
        }

        expect(screen.getByLabelText('Feed stream')).toBeInTheDocument();
        expect(screen.getByLabelText('Wall widgets')).toBeInTheDocument();

        expect(shellVisualBaselineSpec.geometry).toEqual({
            headerHeightPx: 44,
            sidebarWidthPx: 236,
            centerContentMaxWidthPx: 748,
            rightRailWidthPx: 272,
            coreSpacingPx: 18,
        });
    });

    it('documents pending screenshot assertions for Wave 1B', () => {
        expect(shellVisualBaselineSpec.viewport).toEqual({ width: 1440, height: 900 });
        // TODO(thread-v-wave1b): add screenshot assertions using this spec once tooling is enabled.
    });
});
