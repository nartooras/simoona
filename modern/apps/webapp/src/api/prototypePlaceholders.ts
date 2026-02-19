import { resolveDataSource, type DataSource } from './dataSource';

export type PrototypePlaceholderCard = {
    title: string;
    value: string;
};

export type PrototypePlaceholderAction = {
    label: string;
    explanation: string;
};

export type PrototypePlaceholderTable = {
    title: string;
    columns: string[];
    rows: string[][];
};

export type PrototypePlaceholderContent = {
    title: string;
    summary: string;
    cards: PrototypePlaceholderCard[];
    availableNow: string[];
    unavailableInPrototype: string[];
    plannedNextWave: string[];
    actions: PrototypePlaceholderAction[];
    table?: PrototypePlaceholderTable;
    dataSource: DataSource;
};

export type PrototypePlaceholderRoute =
    | '/activities/feed'
    | '/recognition'
    | '/vacations'
    | '/books'
    | '/service-requests'
    | '/teams'
    | '/projects'
    | '/office-map'
    | '/organization/structure'
    | '/committees'
    | '/externals/integrations';

type PrototypeFixture = Omit<PrototypePlaceholderContent, 'dataSource'> & {
    defaultSource: Extract<DataSource, 'mock' | 'disabled'>;
};

const fixtures: Record<PrototypePlaceholderRoute, PrototypeFixture> = {
    '/activities/feed': {
        title: 'Activity Feed',
        summary:
            'This feed demonstrates card density and information hierarchy while live event ingestion remains on legacy.',
        defaultSource: 'mock',
        cards: [
            { title: 'Today posts', value: '18 sample updates loaded from static prototype data.' },
            { title: 'Top topic', value: 'Quarterly planning milestones and team check-ins.' },
            { title: 'Realtime status', value: 'Disabled in prototype; refresh is simulated every 30s.' },
        ],
        availableNow: ['Route and navigation parity for activities feed.', 'Deterministic static cards for demo walkthroughs.'],
        unavailableInPrototype: ['Posting, reactions, and moderation actions are read-only placeholders.'],
        plannedNextWave: ['API-backed feed query integration with filters and paging.'],
        actions: [
            {
                label: 'Create Post',
                explanation: 'Disabled in prototype mode: write actions stay read-only until feed write contracts are migrated.',
            },
        ],
    },
    '/recognition': {
        title: 'Recognition',
        summary:
            'Recognition queue snapshots mirror weekly nomination operations while approval writes stay deferred.',
        defaultSource: 'mock',
        cards: [
            { title: 'Open recognitions', value: '12 draft shout-outs in this static preview set.' },
            { title: 'Most thanked team', value: 'Customer Success (prototype snapshot).' },
            { title: 'Nomination flow', value: 'Read-only visual flow for demo use; submit is not wired.' },
        ],
        availableNow: ['Recognition stream location and shell parity.', 'Static summary cards for demo narrative.'],
        unavailableInPrototype: ['Nomination submit and reward distribution workflows.'],
        plannedNextWave: ['Read-path migration for recognition history and filters.'],
        actions: [
            {
                label: 'Send Recognition',
                explanation: 'Coming in later wave: submission and approvals are intentionally disabled in prototype mode.',
            },
        ],
    },
    '/vacations': {
        title: 'Vacations',
        summary: 'Vacation balance and request history are shown as mock cards without any write capability.',
        defaultSource: 'mock',
        cards: [
            { title: 'Pending requests', value: '3 prototype requests awaiting manager review.' },
            { title: 'Used days', value: '9 days used in this fixture dataset.' },
            { title: 'Next planned leave', value: 'April 15-19 (read-only sample record).' },
        ],
        availableNow: ['Vacation module entry point and route parity.', 'Static history blocks for demo conversations.'],
        unavailableInPrototype: ['New request submit, cancellation, and manager approvals.'],
        plannedNextWave: ['Read endpoint integration for balances and request history.'],
        actions: [
            {
                label: 'Submit Vacation Request',
                explanation: 'Disabled: this prototype pass avoids write flows and approval side effects.',
            },
        ],
    },
    '/books': {
        title: 'Books',
        summary: 'Book catalog placement is preserved with deterministic inventory fixtures for route-complete demos.',
        defaultSource: 'mock',
        cards: [
            { title: 'Catalog items', value: '28 sample books listed for UI layout parity.' },
            { title: 'Available now', value: '15 items currently marked available in fixture data.' },
            { title: 'Category focus', value: 'Leadership and product strategy collections.' },
        ],
        availableNow: ['Catalog navigation visibility for prototype demos.', 'Static inventory summaries and category blocks.'],
        unavailableInPrototype: ['Borrow, return, and reservation actions.'],
        plannedNextWave: ['Read integration for catalog and ownership metadata.'],
        actions: [
            {
                label: 'Borrow Book',
                explanation: 'Coming in later wave: borrow workflow remains disabled in prototype mode.',
            },
        ],
    },
    '/service-requests': {
        title: 'Service Requests',
        summary: 'Service request workflows are intentionally disabled to prevent false write expectations in demos.',
        defaultSource: 'disabled',
        cards: [
            { title: 'Queue visibility', value: 'Only high-level mock queue stats are shown.' },
            { title: 'Workflow state', value: 'Ticket lifecycle actions are not active in prototype mode.' },
            { title: 'Escalation path', value: 'Escalation controls are disabled pending workflow migration ADRs.' },
        ],
        availableNow: ['Navigation and page framing for service operations demos.'],
        unavailableInPrototype: ['Request creation, reassignment, state transitions, and comment writes.'],
        plannedNextWave: ['Define migration-safe read contracts and scoped write-path ADR.'],
        actions: [
            {
                label: 'Create Service Request',
                explanation: 'Disabled in prototype mode: this route is reserved for later wave workflow migration.',
            },
        ],
    },
    '/teams': {
        title: 'Teams',
        summary: 'Teams destination keeps staffing context visible with deterministic headcount and utilization snapshots.',
        defaultSource: 'mock',
        cards: [
            { title: 'Team directory', value: '7 example teams with synthetic headcount values.' },
            { title: 'Capacity panel', value: 'Static utilization indicators for parity demonstration.' },
            { title: 'Manager links', value: 'Profile deep-links are illustrative and not persisted.' },
        ],
        availableNow: ['Teams shell placement and route coverage.', 'Static headcount and utilization cards.'],
        unavailableInPrototype: ['Team edits, membership updates, and planning writes.'],
        plannedNextWave: ['Read-backed team hierarchy and staffing snapshots.'],
        actions: [
            {
                label: 'Create Team',
                explanation: 'Read-only prototype mode: create/edit actions are disabled until later migration waves.',
            },
        ],
    },
    '/projects': {
        title: 'Projects',
        summary: 'Projects route provides a parity-safe dashboard using deterministic milestone fixtures.',
        defaultSource: 'mock',
        cards: [
            { title: 'Active projects', value: '9 mock projects are available for route demo coverage.' },
            { title: 'At-risk initiatives', value: '2 projects flagged in static prototype status set.' },
            { title: 'Delivery horizon', value: 'Next major milestone target: Q2 kickoff.' },
        ],
        availableNow: ['Project route navigation and static milestone overview.', 'Mock status cards supporting demo walkthroughs.'],
        unavailableInPrototype: ['Project creation, edit, and workflow transitions.'],
        plannedNextWave: ['Read models for project list, status, and ownership.'],
        actions: [
            {
                label: 'Create Project',
                explanation: 'Prototype mode keeps this control disabled to avoid introducing write-side behavior.',
            },
        ],
        table: {
            title: 'Prototype project snapshot',
            columns: ['Project', 'Owner', 'Phase', 'Risk'],
            rows: [
                ['Modern API Wave 2', 'Platform Team', 'Execution', 'Low'],
                ['Intranet Refresh', 'Web Team', 'Planning', 'Medium'],
                ['People Data Cleanup', 'Ops Team', 'Validation', 'Low'],
            ],
        },
    },
    '/office-map': {
        title: 'Office Map',
        summary: 'Office map visibility is preserved with static occupancy blocks and simulated floor insights.',
        defaultSource: 'mock',
        cards: [
            { title: 'Tracked offices', value: '3 office locations represented in prototype fixtures.' },
            { title: 'Occupied desks', value: '74/120 desks marked occupied in static view.' },
            { title: 'Interactive map', value: 'Seat assignment interactions are disabled in this wave.' },
        ],
        availableNow: ['Office map route discoverability from company navigation.', 'Static occupancy indicators for demo context.'],
        unavailableInPrototype: ['Desk assignment updates and live location changes.'],
        plannedNextWave: ['Read contracts for floors, desks, and occupancy details.'],
        actions: [
            {
                label: 'Assign Desk',
                explanation: 'Disabled: seat allocation writes are out of scope for this prototype pass.',
            },
        ],
    },
    '/organization/structure': {
        title: 'Organizational Structure',
        summary: 'Organizational hierarchy appears with deterministic department and span-of-control summaries.',
        defaultSource: 'mock',
        cards: [
            { title: 'Departments', value: '12 departments represented in this snapshot.' },
            { title: 'Span of control', value: 'Average manager span is 6.4 in fixture data.' },
            { title: 'Hierarchy updates', value: 'Edit operations are disabled for prototype safety.' },
        ],
        availableNow: ['Hierarchy route and contextual overview cards.', 'Prototype-safe static structure indicators.'],
        unavailableInPrototype: ['Org chart editing and reassignment flows.'],
        plannedNextWave: ['Read-backed hierarchy graph and filters.'],
        actions: [
            {
                label: 'Update Reporting Line',
                explanation: 'Coming in later wave: organizational writes are disabled in prototype mode.',
            },
        ],
    },
    '/committees': {
        title: 'Committees',
        summary: 'Committee pages show deterministic membership and open-seat summaries for route completeness.',
        defaultSource: 'mock',
        cards: [
            { title: 'Active committees', value: '5 committees shown in fixture-backed list.' },
            { title: 'Open seats', value: '4 sample open seats highlighted for demo context.' },
            { title: 'Governance actions', value: 'Join/leave management is disabled in this wave.' },
        ],
        availableNow: ['Committee route coverage and fixture summary cards.', 'Deterministic read-only committee overview.'],
        unavailableInPrototype: ['Member assignment and committee setup writes.'],
        plannedNextWave: ['Read integration for committee membership and term data.'],
        actions: [
            {
                label: 'Create Committee',
                explanation: 'Read-only prototype mode: committee writes are intentionally disabled.',
            },
        ],
    },
    '/externals/integrations': {
        title: 'Integrations',
        summary:
            'This area is visible for IA parity only and is intentionally marked unavailable for production use.',
        defaultSource: 'disabled',
        cards: [
            { title: 'Marketplace', value: 'Disabled for this pass until partner API contracts are approved.' },
            { title: 'Connector health', value: 'No live connector checks are executed in this prototype.' },
            { title: 'Setup actions', value: 'Action buttons are intentionally removed to avoid false expectations.' },
        ],
        availableNow: ['Route visibility for IA parity and demo narrative framing.'],
        unavailableInPrototype: ['Marketplace onboarding, connector setup, and synchronization controls.'],
        plannedNextWave: ['Integration contract sequencing and phased activation plan.'],
        actions: [
            {
                label: 'Add Integration',
                explanation: 'Disabled in prototype mode: external connector writes are deferred to a later wave.',
            },
        ],
    },
};

const routeToSlice = {
    '/activities/feed': 'activitiesFeed',
    '/recognition': 'recognition',
    '/vacations': 'vacations',
    '/books': 'books',
    '/service-requests': 'serviceRequests',
    '/teams': 'teams',
    '/projects': 'projects',
    '/office-map': 'officeMap',
    '/organization/structure': 'organizationalStructure',
    '/committees': 'committees',
    '/externals/integrations': 'integrations',
} as const;

export function getPrototypePlaceholder(route: PrototypePlaceholderRoute): PrototypePlaceholderContent {
    const fixture = fixtures[route];
    const selected = resolveDataSource(routeToSlice[route]);
    const dataSource = selected === 'real' ? fixture.defaultSource : selected;

    return {
        ...fixture,
        cards: fixture.cards.map((card) => ({ ...card })),
        availableNow: fixture.availableNow.map((item) => item),
        unavailableInPrototype: fixture.unavailableInPrototype.map((item) => item),
        plannedNextWave: fixture.plannedNextWave.map((item) => item),
        actions: fixture.actions.map((action) => ({ ...action })),
        table: fixture.table
            ? {
                  title: fixture.table.title,
                  columns: fixture.table.columns.map((column) => column),
                  rows: fixture.table.rows.map((row) => row.map((value) => value)),
              }
            : undefined,
        dataSource,
    };
}
