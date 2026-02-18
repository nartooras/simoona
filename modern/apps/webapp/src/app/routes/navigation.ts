export type RouteAvailability = 'real' | 'mock' | 'disabled';

export type NavigationGroupKey = 'walls' | 'activities' | 'company' | 'externals' | 'system';

export interface NavigationItem {
    to: string;
    label: string;
    end?: boolean;
    availability: RouteAvailability;
    reason?: string;
}

export interface NavigationGroup {
    key: NavigationGroupKey;
    title: string;
    items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
    {
        key: 'walls',
        title: 'Walls',
        items: [
            { to: '/', label: 'Home', end: true, availability: 'real' },
            {
                to: '/activities/feed',
                label: 'Activity Feed',
                availability: 'mock',
                reason: 'Live feed and reactions still run from legacy modules in this prototype.',
            },
            {
                to: '/recognition',
                label: 'Recognition',
                availability: 'mock',
                reason: 'Recognition stream and nomination flows are represented with demo-only static data.',
            },
        ],
    },
    {
        key: 'activities',
        title: 'Activities',
        items: [
            {
                to: '/events',
                label: 'Events',
                availability: 'mock',
                reason: 'Event calendar and reporting remain prototype placeholders with deterministic demo data.',
            },
            {
                to: '/vacations',
                label: 'Vacations',
                availability: 'mock',
                reason: 'Vacation overview is read-only prototype scaffolding; submit and approval flows are deferred.',
            },
            {
                to: '/kudos',
                label: 'Kudos',
                availability: 'mock',
                reason: 'Kudos metrics and history are represented by static cards in prototype mode.',
            },
            {
                to: '/books',
                label: 'Books',
                availability: 'mock',
                reason: 'Book catalog is available as a mock list for IA coverage only in this wave.',
            },
            {
                to: '/service-requests',
                label: 'Service Requests',
                availability: 'disabled',
                reason: 'Service request creation and workflow actions are intentionally disabled in prototype mode.',
            },
        ],
    },
    {
        key: 'company',
        title: 'Company',
        items: [
            { to: '/user-info', label: 'User Info', availability: 'real' },
            { to: '/settings/general', label: 'General Settings', availability: 'real' },
            { to: '/employees', label: 'Employees', availability: 'real' },
            { to: '/profiles/me', label: 'My Profile', availability: 'real' },
            {
                to: '/teams',
                label: 'Teams',
                availability: 'mock',
                reason: 'Team structure and capacity views are available as prototype scaffolding only.',
            },
            {
                to: '/projects',
                label: 'Projects',
                availability: 'mock',
                reason: 'Project boards are represented with static milestone snapshots for demo walkthroughs.',
            },
            {
                to: '/office-map',
                label: 'Office Map',
                availability: 'mock',
                reason: 'Seat map interactions are simulated with static occupancy placeholders in this wave.',
            },
            {
                to: '/organization/structure',
                label: 'Organizational Structure',
                availability: 'mock',
                reason: 'Organizational hierarchy is rendered from prototype fixtures and is not editable.',
            },
            {
                to: '/committees',
                label: 'Committees',
                availability: 'mock',
                reason: 'Committee listings are mock-backed for parity and demo coverage only.',
            },
        ],
    },
    {
        key: 'externals',
        title: 'Externals',
        items: [
            {
                to: '/externals/integrations',
                label: 'Integrations',
                availability: 'disabled',
                reason: 'External marketplace integration is intentionally out of scope for this prototype.',
            },
        ],
    },
    {
        key: 'system',
        title: 'System',
        items: [{ to: '/health', label: 'Health', availability: 'real' }],
    },
];

export interface RouteAvailabilityEntry {
    mode: RouteAvailability;
    reason?: string;
}

const routeEntries = navigationGroups.flatMap((group) =>
    group.items.map((item) => [
        item.to,
        {
            mode: item.availability,
            reason: item.reason,
        } as RouteAvailabilityEntry,
    ]),
);

export const routeAvailabilityMap = Object.fromEntries(routeEntries) as Record<string, RouteAvailabilityEntry>;
