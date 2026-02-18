import { resolveDataSource, type DataSource } from './dataSource';

export interface FeedReply {
    id: string;
    author: string;
    timestamp: string;
    text: string;
}

export interface FeedPost {
    id: string;
    wallLabel: string;
    author: string;
    timestamp: string;
    text: string;
    mediaLabel: string;
    likeCount: number;
    likedByCurrentUser: boolean;
    replies: FeedReply[];
}

export interface WidgetRow {
    id: string;
    primary: string;
    secondary: string;
    subtext?: string;
}

export interface WidgetCardData {
    id: string;
    title: string;
    rows: WidgetRow[];
}

export type HomeSectionState<T> =
    | {
          kind: 'success';
          adapter: Extract<DataSource, 'real' | 'mock'>;
          items: T[];
      }
    | {
          kind: 'empty';
          adapter: Extract<DataSource, 'real' | 'mock'>;
      }
    | {
          kind: 'unavailable';
          adapter: DataSource;
          reason: string;
      };

export interface HomeExperienceResult {
    feed: HomeSectionState<FeedPost>;
    widgets: HomeSectionState<WidgetCardData>;
}

const realFeedFixtures: FeedPost[] = [
    {
        id: 'post-wave-plan',
        wallLabel: 'Company Wall',
        author: 'Milda Vaitke',
        timestamp: 'Today at 10:24',
        text: 'Prototype sprint review is live. Please leave feedback on migration priorities before 15:00.',
        mediaLabel: 'Sprint update attachment preview',
        likeCount: 12,
        likedByCurrentUser: true,
        replies: [
            {
                id: 'reply-priority-audit',
                author: 'Greta Simonyte',
                timestamp: 'Today at 10:47',
                text: 'Reviewed. Auth migration and directory pagination should stay in this sprint scope.',
            },
            {
                id: 'reply-demo-order',
                author: 'Paulius Dainys',
                timestamp: 'Today at 11:03',
                text: 'Added demo order notes in the thread checklist so QA can mirror the flow.',
            },
        ],
    },
    {
        id: 'post-ops-window',
        wallLabel: 'Engineering Wall',
        author: 'Tomas Petrauskas',
        timestamp: 'Today at 08:41',
        text: 'Office map draft for Q2 seating is ready. Team leads can review sections in the Company area.',
        mediaLabel: 'Office map screenshot placeholder',
        likeCount: 8,
        likedByCurrentUser: false,
        replies: [],
    },
    {
        id: 'post-release-checklist',
        wallLabel: 'Product Wall',
        author: 'Rugile Morkunaite',
        timestamp: 'Yesterday at 17:22',
        text: 'Demo rehearsal checklist is locked. Please verify route availability labels before tomorrow standup.',
        mediaLabel: 'Checklist summary placeholder',
        likeCount: 15,
        likedByCurrentUser: false,
        replies: [
            {
                id: 'reply-release-qa',
                author: 'Egle Janulyte',
                timestamp: 'Yesterday at 18:05',
                text: 'QA runbook is synced; I added expected statuses for all mock and disabled routes.',
            },
        ],
    },
];

const mockFeedFixtures: FeedPost[] = [
    {
        id: 'mock-post-wave-plan',
        wallLabel: 'Company Wall',
        author: 'Milda Vaitke',
        timestamp: 'Today at 10:24',
        text: 'Demo parity fixtures are active. Real write paths remain disabled while interactions stay local-only.',
        mediaLabel: 'Mock parity summary preview',
        likeCount: 10,
        likedByCurrentUser: false,
        replies: [
            {
                id: 'mock-reply-scope',
                author: 'Greta Simonyte',
                timestamp: 'Today at 10:51',
                text: 'Confirmed. We can demonstrate the interaction flow without mutating backend state.',
            },
        ],
    },
    {
        id: 'mock-post-rail-order',
        wallLabel: 'Engineering Wall',
        author: 'Jonas Petraitis',
        timestamp: 'Today at 09:12',
        text: 'Right-rail fixture ordering now mirrors legacy priority: Kudos, Events, Rankings, Birthdays.',
        mediaLabel: 'Mock right-rail ordering placeholder',
        likeCount: 6,
        likedByCurrentUser: true,
        replies: [],
    },
];

const realWidgetFixtures: WidgetCardData[] = [
    {
        id: 'widget-kudos',
        title: 'Kudos Feed',
        rows: [
            {
                id: 'kudos-qa',
                primary: 'Egle thanked QA Team',
                secondary: 'Regression coverage for release candidate',
                subtext: '2 hours ago',
            },
            {
                id: 'kudos-api',
                primary: 'Jonas praised API Team',
                secondary: 'Auth hardening and endpoint cleanup',
                subtext: 'Yesterday',
            },
            {
                id: 'kudos-web',
                primary: 'Milda recognized Webapp Team',
                secondary: 'Wave 2A interaction parity delivery',
                subtext: 'This week',
            },
        ],
    },
    {
        id: 'widget-events',
        title: 'Upcoming Events',
        rows: [
            {
                id: 'event-demo',
                primary: 'Feb 20 · Product demo rehearsal',
                secondary: 'Main hall · 14:00',
                subtext: 'Agenda published',
            },
            {
                id: 'event-sync',
                primary: 'Feb 22 · Frontend migration sync',
                secondary: 'Room B4 · 10:00',
                subtext: 'Hybrid attendance',
            },
            {
                id: 'event-allhands',
                primary: 'Feb 25 · Engineering all-hands',
                secondary: 'Townhall stream · 16:00',
                subtext: 'Q&A enabled',
            },
        ],
    },
    {
        id: 'widget-rankings',
        title: 'Rankings',
        rows: [
            {
                id: 'rank-platform',
                primary: '1. Platform Team',
                secondary: '91 points this week',
                subtext: 'Maintained first place',
            },
            {
                id: 'rank-frontend',
                primary: '2. Frontend Team',
                secondary: '84 points this week',
                subtext: '7 points behind',
            },
            {
                id: 'rank-data',
                primary: '3. Data Team',
                secondary: '79 points this week',
                subtext: 'Close sprint finish',
            },
        ],
    },
    {
        id: 'widget-birthdays',
        title: 'Birthdays',
        rows: [
            {
                id: 'birthday-monika',
                primary: 'Monika L.',
                secondary: 'Today',
                subtext: 'Design Systems',
            },
            {
                id: 'birthday-paulius',
                primary: 'Paulius K.',
                secondary: 'Tomorrow',
                subtext: 'Platform Engineering',
            },
        ],
    },
];

const mockWidgetFixtures: WidgetCardData[] = [
    {
        id: 'mock-widget-kudos',
        title: 'Kudos Feed',
        rows: [
            {
                id: 'mock-kudos-1',
                primary: 'Egle thanked QA Team',
                secondary: 'Smoke pass completed',
                subtext: '2 hours ago',
            },
            {
                id: 'mock-kudos-2',
                primary: 'Rugile thanked Product Team',
                secondary: 'Demo narrative alignment',
                subtext: 'Yesterday',
            },
        ],
    },
    {
        id: 'mock-widget-events',
        title: 'Upcoming Events',
        rows: [
            {
                id: 'mock-event-1',
                primary: 'Feb 20 · Demo rehearsal',
                secondary: 'Main hall · 14:00',
                subtext: 'Agenda published',
            },
            {
                id: 'mock-event-2',
                primary: 'Feb 21 · QA sync',
                secondary: 'Room B4 · 11:30',
                subtext: 'Hybrid attendance',
            },
        ],
    },
    {
        id: 'mock-widget-rankings',
        title: 'Rankings',
        rows: [
            {
                id: 'mock-rank-1',
                primary: '1. Platform Team',
                secondary: '87 points',
                subtext: 'Maintained first place',
            },
            {
                id: 'mock-rank-2',
                primary: '2. Frontend Team',
                secondary: '82 points',
                subtext: '5 points behind',
            },
        ],
    },
    {
        id: 'mock-widget-birthdays',
        title: 'Birthdays',
        rows: [
            {
                id: 'mock-birthday-1',
                primary: 'Monika L.',
                secondary: 'Today',
                subtext: 'Design Systems',
            },
        ],
    },
];

const feedAdapters: Record<Extract<DataSource, 'real' | 'mock'>, () => FeedPost[]> = {
    real: () => realFeedFixtures,
    mock: () => mockFeedFixtures,
};

const widgetAdapters: Record<Extract<DataSource, 'real' | 'mock'>, () => WidgetCardData[]> = {
    real: () => realWidgetFixtures,
    mock: () => mockWidgetFixtures,
};

function resolveSection<T>(
    source: DataSource,
    adapters: Record<Extract<DataSource, 'real' | 'mock'>, () => T[]>,
    unavailableReason: string,
): HomeSectionState<T> {
    if (source === 'disabled') {
        return {
            kind: 'unavailable',
            adapter: source,
            reason: unavailableReason,
        };
    }

    const items = adapters[source]();
    if (items.length === 0) {
        return {
            kind: 'empty',
            adapter: source,
        };
    }

    return {
        kind: 'success',
        adapter: source,
        items,
    };
}

export async function fetchHomeExperience(): Promise<HomeExperienceResult> {
    const feedSource = resolveDataSource('activitiesFeed');
    const widgetsSource = resolveDataSource('kudos');

    return {
        feed: resolveSection(
            feedSource,
            feedAdapters,
            'Home feed is unavailable in prototype mode while this slice remains disabled.',
        ),
        widgets: resolveSection(
            widgetsSource,
            widgetAdapters,
            'Home widgets are unavailable in prototype mode while this slice remains disabled.',
        ),
    };
}
