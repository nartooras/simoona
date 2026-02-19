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

    it('keeps deterministic shell structure for Wave 6 parity semantics', async () => {
        const router = createMemoryRouter(appRoutes, {
            initialEntries: [shellVisualBaselineSpec.route],
        });

        render(<RouterProvider router={router} />);

        for (const selector of shellVisualBaselineSpec.selectors) {
            expect(document.querySelector(selector)).not.toBeNull();
        }

        expect(screen.getByLabelText('Feed stream')).toBeInTheDocument();
        expect(screen.getByLabelText('Wall widgets')).toBeInTheDocument();

        const header = screen.getByTestId('app-header');
        const sidebar = screen.getByTestId('app-sidebar');
        const nav = screen.getByRole('navigation', { name: 'Primary navigation' });

        expect(document.querySelector(`[data-shell-geometry="${shellVisualBaselineSpec.semantics.shellGeometryTag}"]`)).not.toBeNull();
        expect(header.classList.contains(`topbar-height-${shellVisualBaselineSpec.semantics.topbarHeightTag}`)).toBe(true);
        expect(document.querySelector(`.${shellVisualBaselineSpec.semantics.topbarGeometryClass}`)).not.toBeNull();
        expect(sidebar.getAttribute('data-left-rail-width')).toBe(shellVisualBaselineSpec.semantics.leftRailWidthTag);
        expect(nav.getAttribute('data-left-rail-density')).toBe(shellVisualBaselineSpec.semantics.leftRailDensityTag);
        expect(shellVisualBaselineSpec.semantics).toEqual({
            shellGeometryTag: 'wave6',
            topbarHeightTag: 'legacy-44',
            topbarGeometryClass: 'topbar-geometry-wave6',
            leftRailWidthTag: 'legacy-236',
            leftRailDensityTag: 'legacy-compact-wave6',
        });
    });

    it('documents pending screenshot assertions for Wave 1B', () => {
        expect(shellVisualBaselineSpec.viewport).toEqual({ width: 1440, height: 900 });
        // TODO(thread-v-wave1b): add screenshot assertions using this spec once tooling is enabled.
    });
});
