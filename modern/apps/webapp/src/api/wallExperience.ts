import { resolveDataSource, type DataSource } from './dataSource';
import { resolveSection, type FeedPost, type SectionState, type WidgetCardData } from './wallExperienceTypes';

export type WallContextId =
    | 'company-wall'
    | 'engineering-wall'
    | 'culture-wall'
    | 'newcomers-wall'
    | 'incident-wall';

export type WallSubscription = 'official' | 'subscribed' | 'unsubscribed';

export type WallSortMode = 'latest' | 'top';

export type WallCategoryFilter = 'all' | 'announcements' | 'delivery' | 'culture' | 'operations';

export interface WallFilterState {
    sort: WallSortMode;
    category: WallCategoryFilter;
}

export interface WallContextSummary {
    id: WallContextId;
    label: string;
    description: string;
    status: 'available' | 'empty' | 'unavailable';
    subscription: WallSubscription;
}

interface WallPostFixture {
    post: FeedPost;
    category: Exclude<WallCategoryFilter, 'all'>;
    recencyRank: number;
}

interface WallContextFixture {
    id: WallContextId;
    label: string;
    description: string;
    status: 'available' | 'empty' | 'unavailable';
    subscription: WallSubscription;
    unavailableReason?: string;
    posts: WallPostFixture[];
    widgets: WidgetCardData[];
}

interface WallExperienceFixtureSet {
    contexts: Record<WallContextId, WallContextFixture>;
}

export interface WallExperienceResult {
    selectedWall: WallContextSummary;
    officialWall: WallContextSummary;
    allWalls: WallContextSummary[];
    subscribedWalls: WallContextSummary[];
    availableWalls: WallContextSummary[];
    filters: WallFilterState;
    feed: SectionState<FeedPost>;
    widgets: SectionState<WidgetCardData>;
}

export interface FetchWallExperienceParams extends WallFilterState {
    wallId: WallContextId;
}

export const wallContextOrder: ReadonlyArray<WallContextId> = [
    'company-wall',
    'engineering-wall',
    'culture-wall',
    'newcomers-wall',
    'incident-wall',
];

export const officialWallId: WallContextId = 'company-wall';

const wallSortLabels: Record<WallSortMode, string> = {
    latest: 'Latest first',
    top: 'Top discussed',
};

const wallCategoryLabels: Record<WallCategoryFilter, string> = {
    all: 'All topics',
    announcements: 'Announcements',
    delivery: 'Delivery',
    culture: 'Culture',
    operations: 'Operations',
};

export const wallSortOptions = (Object.keys(wallSortLabels) as WallSortMode[]).map((key) => ({
    value: key,
    label: wallSortLabels[key],
}));

export const wallCategoryOptions = (Object.keys(wallCategoryLabels) as WallCategoryFilter[]).map((key) => ({
    value: key,
    label: wallCategoryLabels[key],
}));

const realFixtures: WallExperienceFixtureSet = {
    contexts: {
        'company-wall': {
            id: 'company-wall',
            label: 'Company Wall',
            description: 'Cross-team announcements and execution updates for the whole organization.',
            status: 'available',
            subscription: 'official',
            posts: [
                {
                    recencyRank: 95,
                    category: 'announcements',
                    post: {
                        id: 'company-policy-window',
                        wallLabel: 'Company Wall',
                        author: 'Milda Vaitke',
                        timestamp: 'Today at 11:12',
                        text: 'Policy update draft is ready for comments. Please review and annotate directly in the read-only preview before 16:00.',
                        mediaLabel: 'Policy review preview',
                        likeCount: 14,
                        likedByCurrentUser: true,
                        replies: [
                            {
                                id: 'company-policy-reply-1',
                                author: 'Rugile Morkunaite',
                                timestamp: 'Today at 11:24',
                                text: 'Added guidance for scope boundaries in modernization handoffs.',
                                depth: 0,
                            },
                            {
                                id: 'company-policy-reply-2',
                                author: 'Milda Vaitke',
                                timestamp: 'Today at 11:33',
                                text: 'Thanks, this keeps demo narration aligned with read-only expectations.',
                                depth: 1,
                            },
                        ],
                    },
                },
                {
                    recencyRank: 90,
                    category: 'operations',
                    post: {
                        id: 'company-runbook-refresh',
                        wallLabel: 'Company Wall',
                        author: 'Egle Janulyte',
                        timestamp: 'Today at 09:40',
                        text: 'Runbook refresh complete. Wall route steps are now included in the 15-minute walkthrough flow.',
                        likeCount: 9,
                        likedByCurrentUser: false,
                        replies: [],
                    },
                },
                {
                    recencyRank: 80,
                    category: 'delivery',
                    post: {
                        id: 'company-checkpoint',
                        wallLabel: 'Company Wall',
                        author: 'Paulius Dainys',
                        timestamp: 'Yesterday at 16:22',
                        text: 'Checkpoint: route metadata and smoke tests are synchronized across new wall and existing destinations.',
                        mediaLabel: 'Route matrix summary',
                        likeCount: 7,
                        likedByCurrentUser: false,
                        replies: [
                            {
                                id: 'company-checkpoint-reply-1',
                                author: 'Greta Simonyte',
                                timestamp: 'Yesterday at 17:03',
                                text: 'Verified in CI-safe smoke path as well.',
                                depth: 0,
                            },
                        ],
                    },
                },
            ],
            widgets: [
                {
                    id: 'company-widget-highlights',
                    title: 'Kudos Feed',
                    rows: [
                        {
                            id: 'company-kudos-1',
                            primary: 'Release team shipped Wave 8 wall prototype',
                            secondary: 'Read-first behavior confirmed',
                            subtext: '45 minutes ago',
                        },
                        {
                            id: 'company-kudos-2',
                            primary: 'QA team completed deterministic replay pass',
                            secondary: 'No route regressions found',
                            subtext: 'Today',
                        },
                    ],
                },
                {
                    id: 'company-widget-events',
                    title: 'Upcoming Events',
                    rows: [
                        {
                            id: 'company-event-1',
                            primary: 'Wall prototype demo rehearsal',
                            secondary: 'Main hall · 14:00',
                            subtext: 'Agenda locked',
                        },
                        {
                            id: 'company-event-2',
                            primary: 'Architecture decision sync',
                            secondary: 'Room B4 · 16:30',
                            subtext: 'ADR follow-up',
                        },
                    ],
                },
            ],
        },
        'engineering-wall': {
            id: 'engineering-wall',
            label: 'Engineering Wall',
            description: 'Build, integration, and reliability updates for delivery teams.',
            status: 'available',
            subscription: 'subscribed',
            posts: [
                {
                    recencyRank: 96,
                    category: 'delivery',
                    post: {
                        id: 'eng-regression-bundle',
                        wallLabel: 'Engineering Wall',
                        author: 'Jonas Petraitis',
                        timestamp: 'Today at 11:18',
                        text: 'Regression bundle is green after introducing official/all/subscribed wall routes and deterministic feed controls.',
                        mediaLabel: 'Pipeline summary panel',
                        likeCount: 11,
                        likedByCurrentUser: false,
                        replies: [
                            {
                                id: 'eng-regression-reply-1',
                                author: 'Neringa Jankauskaite',
                                timestamp: 'Today at 11:31',
                                text: 'Smoke now explicitly exercises official and subscribed wall routes in demo mode.',
                                depth: 0,
                            },
                        ],
                    },
                },
                {
                    recencyRank: 89,
                    category: 'operations',
                    post: {
                        id: 'eng-api-stability',
                        wallLabel: 'Engineering Wall',
                        author: 'Tomas Petrauskas',
                        timestamp: 'Today at 09:03',
                        text: 'API remained stable through route expansion. No additional write paths were introduced.',
                        likeCount: 6,
                        likedByCurrentUser: false,
                        replies: [],
                    },
                },
                {
                    recencyRank: 81,
                    category: 'announcements',
                    post: {
                        id: 'eng-refactor-note',
                        wallLabel: 'Engineering Wall',
                        author: 'Aiste Jankunaite',
                        timestamp: 'Yesterday at 15:48',
                        text: 'Feed and widget rendering now reuse shared wall columns to keep card anatomy consistent.',
                        likeCount: 13,
                        likedByCurrentUser: true,
                        replies: [
                            {
                                id: 'eng-refactor-reply-1',
                                author: 'Jonas Petraitis',
                                timestamp: 'Yesterday at 16:02',
                                text: 'This should reduce future drift between official and subscribed wall feeds.',
                                depth: 0,
                            },
                        ],
                    },
                },
            ],
            widgets: [
                {
                    id: 'eng-widget-rankings',
                    title: 'Rankings',
                    rows: [
                        {
                            id: 'eng-ranking-1',
                            primary: '1. Platform Team',
                            secondary: '92 points this week',
                            subtext: 'Stable build cadence',
                        },
                        {
                            id: 'eng-ranking-2',
                            primary: '2. Frontend Team',
                            secondary: '88 points this week',
                            subtext: 'Wall parity delivery',
                        },
                    ],
                },
                {
                    id: 'eng-widget-events',
                    title: 'Upcoming Events',
                    rows: [
                        {
                            id: 'eng-event-1',
                            primary: 'API read contracts clinic',
                            secondary: 'Online · 13:00',
                            subtext: 'Schema review',
                        },
                        {
                            id: 'eng-event-2',
                            primary: 'UI parity QA clinic',
                            secondary: 'Room A2 · 15:30',
                            subtext: 'Checklist walk-through',
                        },
                    ],
                },
            ],
        },
        'culture-wall': {
            id: 'culture-wall',
            label: 'People Wall',
            description: 'Culture highlights, onboarding updates, and recognition highlights.',
            status: 'available',
            subscription: 'subscribed',
            posts: [
                {
                    recencyRank: 94,
                    category: 'culture',
                    post: {
                        id: 'culture-onboarding-kit',
                        wallLabel: 'People Wall',
                        author: 'Austeja Gedmintaite',
                        timestamp: 'Today at 10:02',
                        text: 'Onboarding kit now includes route availability explanation so new teammates understand real/mock/disabled scope.',
                        mediaLabel: 'Onboarding card preview',
                        likeCount: 8,
                        likedByCurrentUser: false,
                        replies: [
                            {
                                id: 'culture-onboarding-reply-1',
                                author: 'Monika Leonaviciute',
                                timestamp: 'Today at 10:18',
                                text: 'Great addition. This helps reduce demo confusion.',
                                depth: 0,
                            },
                        ],
                    },
                },
                {
                    recencyRank: 83,
                    category: 'announcements',
                    post: {
                        id: 'culture-feedback-hour',
                        wallLabel: 'People Wall',
                        author: 'Monika Leonaviciute',
                        timestamp: 'Yesterday at 14:20',
                        text: 'Feedback hour is open tomorrow morning for prototype UX polish notes.',
                        likeCount: 4,
                        likedByCurrentUser: false,
                        replies: [],
                    },
                },
            ],
            widgets: [
                {
                    id: 'culture-widget-birthdays',
                    title: 'Birthdays',
                    rows: [
                        {
                            id: 'culture-birthday-1',
                            primary: 'Monika L.',
                            secondary: 'Today',
                            subtext: 'Design Systems',
                        },
                        {
                            id: 'culture-birthday-2',
                            primary: 'Paulius K.',
                            secondary: 'Tomorrow',
                            subtext: 'Platform Engineering',
                        },
                    ],
                },
                {
                    id: 'culture-widget-kudos',
                    title: 'Kudos Feed',
                    rows: [
                        {
                            id: 'culture-kudos-1',
                            primary: 'People Ops thanked Demo Team',
                            secondary: 'Walkthrough preparation support',
                            subtext: 'Today',
                        },
                    ],
                },
            ],
        },
        'newcomers-wall': {
            id: 'newcomers-wall',
            label: 'Newcomers Wall',
            description: 'Onboarding announcements and first-week updates.',
            status: 'empty',
            subscription: 'subscribed',
            posts: [],
            widgets: [
                {
                    id: 'newcomers-widget-events',
                    title: 'Upcoming Events',
                    rows: [
                        {
                            id: 'newcomers-event-1',
                            primary: 'Welcome session',
                            secondary: 'Friday · 09:30',
                            subtext: 'Host: People Ops',
                        },
                    ],
                },
            ],
        },
        'incident-wall': {
            id: 'incident-wall',
            label: 'Incident Wall',
            description: 'Restricted incident updates requiring legacy-only access.',
            status: 'unavailable',
            subscription: 'unsubscribed',
            unavailableReason:
                'Incident wall data is unavailable in the modern prototype while access control and redaction policies remain in legacy modules.',
            posts: [],
            widgets: [],
        },
    },
};

const mockFixtures: WallExperienceFixtureSet = {
    contexts: {
        'company-wall': {
            id: 'company-wall',
            label: 'Company Wall',
            description: 'Mocked cross-team announcements for deterministic walkthroughs.',
            status: 'available',
            subscription: 'official',
            posts: [
                {
                    recencyRank: 93,
                    category: 'announcements',
                    post: {
                        id: 'mock-company-demo-window',
                        wallLabel: 'Company Wall',
                        author: 'Demo Moderator',
                        timestamp: 'Today at 10:10',
                        text: 'Mock wall context is active. Use selector and filters to demonstrate deterministic switching behavior.',
                        likeCount: 5,
                        likedByCurrentUser: false,
                        replies: [
                            {
                                id: 'mock-company-demo-window-reply-1',
                                author: 'QA Observer',
                                timestamp: 'Today at 10:18',
                                text: 'Switching remains stable between repeated runs.',
                                depth: 0,
                            },
                        ],
                    },
                },
                {
                    recencyRank: 86,
                    category: 'delivery',
                    post: {
                        id: 'mock-company-checkpoint',
                        wallLabel: 'Company Wall',
                        author: 'Demo Operator',
                        timestamp: 'Today at 09:01',
                        text: 'Route metadata and contract notice remain aligned while this wall is mock-backed.',
                        mediaLabel: 'Mock contract marker snapshot',
                        likeCount: 8,
                        likedByCurrentUser: true,
                        replies: [],
                    },
                },
            ],
            widgets: [
                {
                    id: 'mock-company-widget-kudos',
                    title: 'Kudos Feed',
                    rows: [
                        {
                            id: 'mock-company-kudos-1',
                            primary: 'Demo team completed smoke pass',
                            secondary: 'Wall route included',
                            subtext: '30 minutes ago',
                        },
                    ],
                },
            ],
        },
        'engineering-wall': {
            id: 'engineering-wall',
            label: 'Engineering Wall',
            description: 'Mocked engineering updates for deterministic filtering and sorting.',
            status: 'available',
            subscription: 'subscribed',
            posts: [
                {
                    recencyRank: 92,
                    category: 'operations',
                    post: {
                        id: 'mock-eng-ops-note',
                        wallLabel: 'Engineering Wall',
                        author: 'Build Bot',
                        timestamp: 'Today at 10:52',
                        text: 'No deploy blockers detected. Demo-safe interactions remain local-only on wall cards.',
                        likeCount: 3,
                        likedByCurrentUser: false,
                        replies: [],
                    },
                },
                {
                    recencyRank: 87,
                    category: 'delivery',
                    post: {
                        id: 'mock-eng-filter-check',
                        wallLabel: 'Engineering Wall',
                        author: 'Feature Guard',
                        timestamp: 'Today at 09:20',
                        text: 'Filter behavior is deterministic: category + sort transformations run client-side only.',
                        likeCount: 9,
                        likedByCurrentUser: false,
                        replies: [
                            {
                                id: 'mock-eng-filter-check-reply-1',
                                author: 'Demo Moderator',
                                timestamp: 'Today at 09:37',
                                text: 'Good for replayable demos without backend writes.',
                                depth: 0,
                            },
                        ],
                    },
                },
            ],
            widgets: [
                {
                    id: 'mock-eng-widget-ranking',
                    title: 'Rankings',
                    rows: [
                        {
                            id: 'mock-eng-ranking-1',
                            primary: '1. Platform Team',
                            secondary: '88 points',
                            subtext: 'Mock standings',
                        },
                    ],
                },
            ],
        },
        'culture-wall': {
            id: 'culture-wall',
            label: 'People Wall',
            description: 'Mocked people updates with realistic but deterministic content.',
            status: 'available',
            subscription: 'subscribed',
            posts: [
                {
                    recencyRank: 91,
                    category: 'culture',
                    post: {
                        id: 'mock-culture-highlight',
                        wallLabel: 'People Wall',
                        author: 'People Ops',
                        timestamp: 'Today at 10:05',
                        text: 'Recognition highlights remain fixture-backed for walkthrough stability.',
                        likeCount: 6,
                        likedByCurrentUser: false,
                        replies: [],
                    },
                },
            ],
            widgets: [
                {
                    id: 'mock-culture-widget-birthdays',
                    title: 'Birthdays',
                    rows: [
                        {
                            id: 'mock-culture-birthday-1',
                            primary: 'Monika L.',
                            secondary: 'Today',
                            subtext: 'Design Systems',
                        },
                    ],
                },
            ],
        },
        'newcomers-wall': {
            id: 'newcomers-wall',
            label: 'Newcomers Wall',
            description: 'Mock onboarding wall with no current posts.',
            status: 'empty',
            subscription: 'subscribed',
            posts: [],
            widgets: [
                {
                    id: 'mock-newcomers-widget-events',
                    title: 'Upcoming Events',
                    rows: [
                        {
                            id: 'mock-newcomers-event-1',
                            primary: 'Welcome coffee chat',
                            secondary: 'Friday · 10:00',
                            subtext: 'Hosted by People Ops',
                        },
                    ],
                },
            ],
        },
        'incident-wall': {
            id: 'incident-wall',
            label: 'Incident Wall',
            description: 'Restricted incident updates requiring legacy-only access.',
            status: 'unavailable',
            subscription: 'unsubscribed',
            unavailableReason:
                'Incident wall data is unavailable in demo mode while the redacted incident feed remains in legacy systems.',
            posts: [],
            widgets: [],
        },
    },
};

const wallAdapterNotes = Object.freeze({
    feed: 'Wall feed resolves from activitiesFeed source (real outside demo, mock in demo) with deterministic client-side sort/filter transforms.',
    widgets: 'Wall widgets resolve from kudos source (real outside demo, mock in demo) and remain read-only.',
    contexts:
        'Wall collections expose mandatory official context, all walls, and subscribed walls from deterministic fixture-backed metadata with no persistent writes.',
});

function toWallSummary(context: WallContextFixture): WallContextSummary {
    return {
        id: context.id,
        label: context.label,
        description: context.description,
        status: context.status,
        subscription: context.subscription,
    };
}

export interface WallCollections {
    officialWall: WallContextSummary;
    allWalls: WallContextSummary[];
    subscribedWalls: WallContextSummary[];
}

export function getWallFeedPath(wallId: WallContextId): string {
    return wallId === officialWallId ? '/' : `/walls/${wallId}`;
}

function toWallCollections(fixtures: WallExperienceFixtureSet): WallCollections {
    const allWalls = wallContextOrder.map((wallId) => toWallSummary(fixtures.contexts[wallId]));
    const subscribedWalls = wallContextOrder
        .map((wallId) => fixtures.contexts[wallId])
        .filter((wall) => wall.subscription === 'subscribed')
        .map((wall) => toWallSummary(wall));

    return {
        officialWall: toWallSummary(fixtures.contexts[officialWallId]),
        allWalls,
        subscribedWalls,
    };
}

export function getWallCollections(source: DataSource = resolveDataSource('activitiesFeed')): WallCollections {
    const fixtures = selectFixtures(source);
    return toWallCollections(fixtures);
}

function selectFixtures(source: DataSource): WallExperienceFixtureSet {
    if (source === 'mock') {
        return mockFixtures;
    }

    return realFixtures;
}

function applyFeedTransforms(entries: WallPostFixture[], filters: WallFilterState): FeedPost[] {
    const filteredEntries =
        filters.category === 'all' ? entries : entries.filter((entry) => entry.category === filters.category);

    return [...filteredEntries]
        .sort((left, right) => {
            if (filters.sort === 'latest') {
                if (left.recencyRank !== right.recencyRank) {
                    return right.recencyRank - left.recencyRank;
                }

                return left.post.id.localeCompare(right.post.id);
            }

            if (left.post.likeCount !== right.post.likeCount) {
                return right.post.likeCount - left.post.likeCount;
            }

            if (left.recencyRank !== right.recencyRank) {
                return right.recencyRank - left.recencyRank;
            }

            return left.post.id.localeCompare(right.post.id);
        })
        .map((entry) => entry.post);
}

function resolveUnavailableSection<T>(source: DataSource, reason: string): SectionState<T> {
    return {
        kind: 'unavailable',
        adapter: source,
        reason,
    };
}

export async function fetchWallExperience(params: FetchWallExperienceParams): Promise<WallExperienceResult> {
    const feedSource = resolveDataSource('activitiesFeed');
    const widgetsSource = resolveDataSource('kudos');
    const fixtures = selectFixtures(feedSource);
    const selectedContext = fixtures.contexts[params.wallId] ?? fixtures.contexts[officialWallId];
    const collections = toWallCollections(fixtures);

    const feedUnavailableReason =
        selectedContext.status === 'unavailable'
            ? selectedContext.unavailableReason ?? 'Selected wall feed is unavailable in this prototype snapshot.'
            : 'Wall feed is unavailable in prototype mode while this slice remains disabled.';

    const widgetsUnavailableReason =
        selectedContext.status === 'unavailable'
            ? selectedContext.unavailableReason ?? 'Selected wall widgets are unavailable in this prototype snapshot.'
            : 'Wall widgets are unavailable in prototype mode while this slice remains disabled.';

    const transformedPosts = applyFeedTransforms(selectedContext.posts, params);

    const feed =
        selectedContext.status === 'unavailable'
            ? resolveUnavailableSection<FeedPost>(feedSource, feedUnavailableReason)
            : resolveSection(
                  feedSource,
                  {
                      real: () => transformedPosts,
                      mock: () => transformedPosts,
                  },
                  feedUnavailableReason,
              );

    const widgets =
        selectedContext.status === 'unavailable'
            ? resolveUnavailableSection<WidgetCardData>(widgetsSource, widgetsUnavailableReason)
            : resolveSection(
                  widgetsSource,
                  {
                      real: () => selectedContext.widgets,
                      mock: () => selectedContext.widgets,
                  },
                  widgetsUnavailableReason,
              );

    return {
        selectedWall: toWallSummary(selectedContext),
        officialWall: collections.officialWall,
        allWalls: collections.allWalls,
        subscribedWalls: collections.subscribedWalls,
        availableWalls: collections.allWalls,
        filters: {
            sort: params.sort,
            category: params.category,
        },
        feed,
        widgets,
    };
}

export function getWallAdapterNotes(): Readonly<typeof wallAdapterNotes> {
    return wallAdapterNotes;
}
