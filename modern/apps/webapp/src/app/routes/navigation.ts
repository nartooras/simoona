export type RouteAvailability = 'real' | 'mock' | 'disabled';

export type NavigationGroupKey = 'activities' | 'company' | 'externals' | 'system';

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
        key: 'activities',
        title: 'Activities',
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
        key: 'company',
        title: 'Company',
        items: [
            { to: '/employees', label: 'Employees', availability: 'real' },
            { to: '/profiles/me', label: 'My Profile', availability: 'real' },
            { to: '/user-info', label: 'User Info', availability: 'real' },
            { to: '/settings/general', label: 'General Settings', availability: 'real' },
            {
                to: '/teams',
                label: 'Teams',
                availability: 'mock',
                reason: 'Team structure and capacity views are available as prototype scaffolding only.',
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
