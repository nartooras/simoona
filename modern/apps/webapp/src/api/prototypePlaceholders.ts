import { resolveDataSource, type DataSource } from './dataSource';

export type PrototypePlaceholderCard = {
    title: string;
    value: string;
};

export type PrototypePlaceholderContent = {
    title: string;
    summary: string;
    cards: PrototypePlaceholderCard[];
    dataSource: DataSource;
};

export type PrototypePlaceholderRoute = '/activities/feed' | '/recognition' | '/teams' | '/externals/integrations';

type PrototypeFixture = Omit<PrototypePlaceholderContent, 'dataSource'>;

const fixtures: Record<PrototypePlaceholderRoute, PrototypeFixture> = {
    '/activities/feed': {
        title: 'Activity Feed',
        summary:
            'This feed demonstrates card density and information hierarchy while live event ingestion remains on legacy.',
        cards: [
            { title: 'Today posts', value: '18 sample updates loaded from static prototype data.' },
            { title: 'Top topic', value: 'Quarterly planning milestones and team check-ins.' },
            { title: 'Realtime status', value: 'Disabled in prototype; refresh is simulated every 30s.' },
        ],
    },
    '/recognition': {
        title: 'Recognition',
        summary:
            'Recognition cards are visual placeholders that mirror the planned IA location for social modules.',
        cards: [
            { title: 'Open recognitions', value: '12 draft shout-outs in this static preview set.' },
            { title: 'Most thanked team', value: 'Customer Success (prototype snapshot).' },
            { title: 'Nomination flow', value: 'Read-only visual flow for demo use; submit is not wired.' },
        ],
    },
    '/teams': {
        title: 'Teams',
        summary: 'The teams area is included to preserve legacy IA expectations during prototype walkthroughs.',
        cards: [
            { title: 'Team directory', value: '7 example teams with synthetic headcount values.' },
            { title: 'Capacity panel', value: 'Static utilization indicators for parity demonstration.' },
            { title: 'Manager links', value: 'Profile deep-links are illustrative and not persisted.' },
        ],
    },
    '/externals/integrations': {
        title: 'Integrations',
        summary:
            'This area is visible for IA parity only and is intentionally marked unavailable for production use.',
        cards: [
            { title: 'Marketplace', value: 'Disabled for this pass until partner API contracts are approved.' },
            { title: 'Connector health', value: 'No live connector checks are executed in this prototype.' },
            { title: 'Setup actions', value: 'Action buttons are intentionally removed to avoid false expectations.' },
        ],
    },
};

const routeToSlice = {
    '/activities/feed': 'activitiesFeed',
    '/recognition': 'recognition',
    '/teams': 'teams',
    '/externals/integrations': 'integrations',
} as const;

export function getPrototypePlaceholder(route: PrototypePlaceholderRoute): PrototypePlaceholderContent {
    const fixture = fixtures[route];
    const selected = resolveDataSource(routeToSlice[route]);
    let dataSource: DataSource = selected;
    if (dataSource !== 'mock') {
        dataSource = 'mock';
    }

    return {
        ...fixture,
        cards: fixture.cards.map((card) => ({ ...card })),
        dataSource,
    };
}
