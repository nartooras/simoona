export interface ShellVisualBaselineSpec {
    readonly route: string;
    readonly viewport: {
        readonly width: number;
        readonly height: number;
    };
    readonly selectors: readonly string[];
    readonly geometry: {
        readonly headerHeightPx: number;
        readonly sidebarWidthPx: number;
        readonly centerContentMaxWidthPx: number;
        readonly rightRailWidthPx: number;
        readonly coreSpacingPx: number;
    };
}

export const shellVisualBaselineSpec: ShellVisualBaselineSpec = {
    route: '/',
    viewport: {
        width: 1440,
        height: 900,
    },
    selectors: [
        '[data-shell-geometry="wave1a"]',
        '[data-testid="app-header"]',
        '[data-testid="app-sidebar"]',
        '[data-testid="app-content"]',
        '[data-testid="wall-content-grid"]',
        '[data-testid="wall-feed-column"]',
        '[data-testid="wall-widgets-column"]',
    ],
    geometry: {
        headerHeightPx: 44,
        sidebarWidthPx: 236,
        centerContentMaxWidthPx: 748,
        rightRailWidthPx: 272,
        coreSpacingPx: 18,
    },
};
