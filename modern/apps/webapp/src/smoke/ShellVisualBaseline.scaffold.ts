export interface ShellVisualBaselineSpec {
    readonly route: string;
    readonly viewport: {
        readonly width: number;
        readonly height: number;
    };
    readonly selectors: readonly string[];
    readonly semantics: {
        readonly shellGeometryTag: string;
        readonly topbarHeightTag: string;
        readonly topbarGeometryClass: string;
        readonly leftRailWidthTag: string;
        readonly leftRailDensityTag: string;
    };
}

export const shellVisualBaselineSpec: ShellVisualBaselineSpec = {
    route: '/',
    viewport: {
        width: 1440,
        height: 900,
    },
    selectors: [
        '[data-shell-geometry="wave6"]',
        '[data-theme-system="legacy-unified-wave7"]',
        '[data-testid="app-header"]',
        '[data-testid="app-sidebar"]',
        '[data-testid="app-content"]',
        '[data-testid="wall-content-grid"]',
        '[data-testid="wall-feed-column"]',
        '[data-testid="wall-widgets-column"]',
    ],
    semantics: {
        shellGeometryTag: 'wave6',
        topbarHeightTag: 'legacy-44',
        topbarGeometryClass: 'topbar-geometry-wave6',
        leftRailWidthTag: 'legacy-236',
        leftRailDensityTag: 'legacy-compact-wave6',
    },
};
