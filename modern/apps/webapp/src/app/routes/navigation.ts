import { getWallCollections, getWallFeedPath } from '../../api/wallExperience';

export type RouteAvailability = 'real' | 'mock' | 'disabled';
export type RouteDestinationMode = 'real-backed' | 'mock-backed' | 'disabled';

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

interface NavigationGroupDefinition {
    key: NavigationGroupKey;
    title: string;
}

export interface NavigationRouteDefinition {
    path: string;
    label: string;
    group: NavigationGroupKey;
    availability: RouteAvailability;
    destinationMode: RouteDestinationMode;
    demoNote: string;
    end?: boolean;
    reason?: string;
}

const navigationGroupDefinitions: ReadonlyArray<NavigationGroupDefinition> = [
    { key: 'walls', title: 'Walls' },
    { key: 'activities', title: 'Activities' },
    { key: 'company', title: 'Company' },
    { key: 'externals', title: 'Externals' },
    { key: 'system', title: 'System' },
];

const wallCollections = getWallCollections();

const wallRouteDefinitions: NavigationRouteDefinition[] = [
    {
        path: '/',
        label: 'Official wall',
        group: 'walls',
        end: true,
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Official wall context remains deterministic and fixture-backed while read contract migration is in progress.',
        demoNote: 'Mandatory official wall feed context aligned to legacy IA with read-only interactions.',
    },
    {
        path: '/walls',
        label: 'All walls',
        group: 'walls',
        end: true,
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'All walls directory is deterministic and fixture-backed while subscribed wall contracts are still migrating.',
        demoNote: 'Read-only all-walls directory with explicit official, subscribed, empty, and unavailable context states.',
    },
    ...wallCollections.subscribedWalls.map<NavigationRouteDefinition>((wall) => ({
        path: getWallFeedPath(wall.id),
        label: wall.label,
        group: 'walls',
        end: true,
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Subscribed wall feeds are deterministic fixture-backed contexts during read-first migration.',
        demoNote: `Subscribed wall feed for ${wall.label} context with deterministic filtering and no persistent writes.`,
    })),
];

export const navigationRouteDefinitions: ReadonlyArray<NavigationRouteDefinition> = [
    ...wallRouteDefinitions,
    {
        path: '/activities/feed',
        label: 'Activity Feed',
        group: 'activities',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Live feed and reactions still run from legacy modules in this prototype.',
        demoNote: 'Fixture-backed feed cards preserve stream density and walkthrough flow without writes.',
    },
    {
        path: '/recognition',
        label: 'Recognition',
        group: 'activities',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Recognition stream and nomination flows are represented with demo-only static data.',
        demoNote: 'Shows deterministic recognition totals and queue state for legacy IA parity.',
    },
    {
        path: '/events',
        label: 'Events',
        group: 'activities',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Event discovery is deterministic and read-only while RSVP and event-management writes remain deferred.',
        demoNote: 'Legacy-like grouped events view with deterministic filters, detail expansion, and contextual widgets.',
    },
    {
        path: '/kudos',
        label: 'Kudos',
        group: 'activities',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Kudos feed and leaderboard are fixture-backed; give-kudos submission stays disabled in prototype mode.',
        demoNote: 'Dense kudos feed with deterministic period/type/team filters, leaderboard panel, and disabled give action.',
    },
    {
        path: '/service-requests',
        label: 'Service Requests',
        group: 'activities',
        availability: 'disabled',
        destinationMode: 'disabled',
        reason: 'Service request creation and workflow actions are intentionally disabled in prototype mode.',
        demoNote: 'Route is intentionally unavailable for workflow safety; page explains deferred write scope.',
    },
    {
        path: '/books',
        label: 'Books',
        group: 'activities',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Book catalog is available as a mock list for IA coverage only in this wave.',
        demoNote: 'Catalog snapshot preserves legacy placement and read-only discovery narrative.',
    },
    {
        path: '/vacations',
        label: 'Vacations',
        group: 'activities',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Vacation overview is read-only prototype scaffolding; submit and approval flows are deferred.',
        demoNote: 'Read-only balances/history blocks keep expectations close to legacy vacation overview.',
    },
    {
        path: '/office-map',
        label: 'Office Map',
        group: 'company',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Seat map interactions are simulated with static occupancy placeholders in this wave.',
        demoNote: 'Static occupancy metrics keep office visibility while assignment writes stay deferred.',
    },
    {
        path: '/organization/structure',
        label: 'Organizational Structure',
        group: 'company',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Organizational hierarchy is rendered from prototype fixtures and is not editable.',
        demoNote: 'Hierarchy summaries remain deterministic and non-editable for parity-safe demos.',
    },
    {
        path: '/employees',
        label: 'Employees',
        group: 'company',
        availability: 'real',
        destinationMode: 'real-backed',
        demoNote: 'Backed by modern API employee directory read contract with fallback states.',
    },
    {
        path: '/projects',
        label: 'Projects',
        group: 'company',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Project boards are represented with static milestone snapshots for demo walkthroughs.',
        demoNote: 'Milestone/risk snapshot table mirrors legacy project-at-a-glance scanning.',
    },
    {
        path: '/committees',
        label: 'Committees',
        group: 'company',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Committee listings are mock-backed for parity and demo coverage only.',
        demoNote: 'Deterministic membership and open-seat summaries preserve committee IA destination.',
    },
    {
        path: '/teams',
        label: 'Teams',
        group: 'company',
        availability: 'mock',
        destinationMode: 'mock-backed',
        reason: 'Team structure and capacity views are available as prototype scaffolding only.',
        demoNote: 'Read-only team directory/capacity blocks keep destination meaningful and non-empty.',
    },
    {
        path: '/user-info',
        label: 'User Info',
        group: 'company',
        availability: 'real',
        destinationMode: 'real-backed',
        demoNote: 'Backed by modern API user info endpoint with standard loading/error handling.',
    },
    {
        path: '/settings/general',
        label: 'General Settings',
        group: 'company',
        availability: 'real',
        destinationMode: 'real-backed',
        demoNote: 'Backed by modern API general settings read contract and explicit empty/unavailable states.',
    },
    {
        path: '/profiles/me',
        label: 'My Profile',
        group: 'company',
        availability: 'real',
        destinationMode: 'real-backed',
        demoNote: 'Backed by modern API profile read contract with non-empty fallback rendering.',
    },
    {
        path: '/externals/integrations',
        label: 'Integrations',
        group: 'externals',
        availability: 'disabled',
        destinationMode: 'disabled',
        reason: 'External marketplace integration is intentionally out of scope for this prototype.',
        demoNote: 'Visible for IA parity with explicit disabled-state narrative for deferred connector flows.',
    },
    {
        path: '/health',
        label: 'Health',
        group: 'system',
        availability: 'real',
        destinationMode: 'real-backed',
        demoNote: 'Baseline health destination confirms modern API readiness for demo startup checks.',
    },
];

export type NavigationRoutePath = string;

const routeDefinitionsByPath = Object.fromEntries(
    navigationRouteDefinitions.map((entry) => [entry.path, entry]),
) as Record<string, NavigationRouteDefinition>;

const groupTitleByKey = Object.fromEntries(
    navigationGroupDefinitions.map((group) => [group.key, group.title]),
) as Record<NavigationGroupKey, string>;

function availabilityFromDestination(destinationMode: RouteDestinationMode): RouteAvailability {
    if (destinationMode === 'real-backed') {
        return 'real';
    }

    if (destinationMode === 'mock-backed') {
        return 'mock';
    }

    return 'disabled';
}

function assertNavigationConsistency() {
    const seenPaths = new Set<string>();
    const seenLabels = new Set<string>();

    for (const entry of navigationRouteDefinitions) {
        const routeReason = 'reason' in entry ? entry.reason : undefined;

        if (!entry.path.startsWith('/')) {
            throw new Error(`Navigation route path must start with '/': ${entry.path}`);
        }

        if (seenPaths.has(entry.path)) {
            throw new Error(`Duplicate navigation route path detected: ${entry.path}`);
        }

        seenPaths.add(entry.path);

        if (!entry.label.trim()) {
            throw new Error(`Navigation route ${entry.path} must include a non-empty label.`);
        }

        if (seenLabels.has(entry.label)) {
            throw new Error(`Duplicate navigation route label detected: ${entry.label}`);
        }

        seenLabels.add(entry.label);

        if (!groupTitleByKey[entry.group]) {
            throw new Error(`Navigation route ${entry.path} references unknown group ${entry.group}`);
        }

        const expectedAvailability = availabilityFromDestination(entry.destinationMode);
        if (entry.availability !== expectedAvailability) {
            throw new Error(
                `Navigation route ${entry.path} availability '${entry.availability}' must match destination mode '${entry.destinationMode}'.`,
            );
        }

        if (entry.availability !== 'real' && !routeReason) {
            throw new Error(`Navigation route ${entry.path} requires a reason for availability '${entry.availability}'.`);
        }

        if (entry.availability === 'real' && routeReason) {
            throw new Error(`Navigation route ${entry.path} should not include a reason when availability is 'real'.`);
        }

        if (!entry.demoNote.trim()) {
            throw new Error(`Navigation route ${entry.path} must include a non-empty demo note.`);
        }
    }
}

assertNavigationConsistency();

export const navigationGroups: NavigationGroup[] = navigationGroupDefinitions.map((group) => ({
    key: group.key,
    title: group.title,
    items: navigationRouteDefinitions
        .filter((entry) => entry.group === group.key)
        .map((entry) => ({
            to: entry.path,
            label: entry.label,
            end: 'end' in entry ? entry.end : undefined,
            availability: entry.availability,
            reason: 'reason' in entry ? entry.reason : undefined,
        })),
}));

export interface RouteAvailabilityEntry {
    mode: RouteAvailability;
    reason?: string;
}

const routeEntries = navigationRouteDefinitions.map((entry) => [
    entry.path,
    {
        mode: entry.availability,
        reason: 'reason' in entry ? entry.reason : undefined,
    } as RouteAvailabilityEntry,
]);

export const routeAvailabilityMap = Object.fromEntries(routeEntries) as Record<string, RouteAvailabilityEntry>;

export interface RouteStatusMatrixEntry {
    route: string;
    label: string;
    navGroup: string;
    availability: RouteAvailability;
    destinationMode: RouteDestinationMode;
    demoNote: string;
}

export const routeStatusMatrix: RouteStatusMatrixEntry[] = navigationRouteDefinitions.map((entry) => ({
    route: entry.path,
    label: entry.label,
    navGroup: groupTitleByKey[entry.group],
    availability: entry.availability,
    destinationMode: entry.destinationMode,
    demoNote: entry.demoNote,
}));

export function getRouteDefinition(path: string): NavigationRouteDefinition {
    const routeDefinition = routeDefinitionsByPath[path];
    if (!routeDefinition) {
        throw new Error(`Unknown navigation route path: ${path}`);
    }

    return routeDefinition;
}
