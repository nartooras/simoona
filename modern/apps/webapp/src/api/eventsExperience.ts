import { resolveDataSource, type DataSource } from './dataSource';

export type EventsTimeframeFilter = 'all' | 'upcoming' | 'past';
export type EventsOfficeFilter = 'all' | 'vilnius' | 'kaunas' | 'remote' | 'tallinn';
export type EventsTypeFilter = 'all' | 'company' | 'learning' | 'social' | 'external';
export type EventsSortMode = 'soonest' | 'latest' | 'title';

export interface EventsFilterState {
    timeframe: EventsTimeframeFilter;
    office: EventsOfficeFilter;
    type: EventsTypeFilter;
    sort: EventsSortMode;
}

export type EventsExperienceParams = Partial<EventsFilterState>;

export interface EventsOption<TValue extends string> {
    value: TValue;
    label: string;
}

export const eventsTimeframeOptions: ReadonlyArray<EventsOption<EventsTimeframeFilter>> = [
    { value: 'all', label: 'Upcoming + past' },
    { value: 'upcoming', label: 'Upcoming only' },
    { value: 'past', label: 'Past only' },
];

export const eventsOfficeOptions: ReadonlyArray<EventsOption<EventsOfficeFilter>> = [
    { value: 'all', label: 'All offices' },
    { value: 'vilnius', label: 'Vilnius' },
    { value: 'kaunas', label: 'Kaunas' },
    { value: 'remote', label: 'Remote' },
    { value: 'tallinn', label: 'Tallinn (demo-empty)' },
];

export const eventsTypeOptions: ReadonlyArray<EventsOption<EventsTypeFilter>> = [
    { value: 'all', label: 'All types' },
    { value: 'company', label: 'Company' },
    { value: 'learning', label: 'Learning' },
    { value: 'social', label: 'Social' },
    { value: 'external', label: 'External partners (deferred)' },
];

export const eventsSortOptions: ReadonlyArray<EventsOption<EventsSortMode>> = [
    { value: 'soonest', label: 'Soonest first' },
    { value: 'latest', label: 'Latest first' },
    { value: 'title', label: 'Title A-Z' },
];

export interface EventRecord {
    id: string;
    title: string;
    startsOn: string;
    dateLabel: string;
    timeLabel: string;
    office: Exclude<EventsOfficeFilter, 'all' | 'tallinn'>;
    locationLabel: string;
    type: Exclude<EventsTypeFilter, 'all' | 'external'>;
    status: 'Scheduled' | 'Open' | 'Completed';
    owner: string;
    audience: string;
    summary: string;
}

export interface EventsWidgetRow {
    id: string;
    label: string;
    value: string;
}

export interface EventsWidgetCard {
    id: string;
    title: string;
    rows: EventsWidgetRow[];
}

export type EventsSectionState<TItem> =
    | {
          kind: 'success';
          adapter: Extract<DataSource, 'real' | 'mock'>;
          items: TItem[];
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

export interface EventsSummaryCard {
    label: string;
    value: string;
}

export interface EventsExperienceResult {
    kind: 'eventsExperience';
    dataSource: DataSource;
    filters: EventsFilterState;
    summaryCards: EventsSummaryCard[];
    upcoming: EventsSectionState<EventRecord>;
    past: EventsSectionState<EventRecord>;
    widgets: EventsSectionState<EventsWidgetCard>;
    notes: {
        schedule: string;
        widgets: string;
    };
}

interface EventFixture extends EventRecord {
    startsAt: string;
}

const defaultFilters: EventsFilterState = {
    timeframe: 'all',
    office: 'all',
    type: 'all',
    sort: 'soonest',
};

const eventsAnchorDate = '2026-03-15';
const externalEventsDeferredReason =
    'External partner event data remains deferred in this read-first prototype. Select internal event types to continue.';
const eventsDisabledReason = 'Events source is currently unavailable in this prototype environment.';

const realFixtures: EventFixture[] = [
    {
        id: 'real-allhands-march',
        title: 'Company All-hands',
        startsAt: '2026-03-26T09:00:00Z',
        startsOn: '2026-03-26',
        dateLabel: 'Thu, Mar 26',
        timeLabel: '11:00-12:00 EET',
        office: 'vilnius',
        locationLabel: 'Vilnius HQ, Orion Hall',
        type: 'company',
        status: 'Scheduled',
        owner: 'People Ops',
        audience: 'All employees',
        summary: 'Quarter update, leadership Q&A, and roadmap milestone highlights.',
    },
    {
        id: 'real-api-retro',
        title: 'API Migration Retrospective',
        startsAt: '2026-03-20T13:00:00Z',
        startsOn: '2026-03-20',
        dateLabel: 'Fri, Mar 20',
        timeLabel: '15:00-16:00 EET',
        office: 'kaunas',
        locationLabel: 'Kaunas Hub, River Room',
        type: 'learning',
        status: 'Open',
        owner: 'Platform Guild',
        audience: 'Engineering + QA',
        summary: 'Read-first migration lessons and contract reliability review.',
    },
    {
        id: 'real-brand-huddle',
        title: 'Culture Connect Huddle',
        startsAt: '2026-03-18T10:30:00Z',
        startsOn: '2026-03-18',
        dateLabel: 'Wed, Mar 18',
        timeLabel: '12:30-13:15 EET',
        office: 'remote',
        locationLabel: 'Remote livestream',
        type: 'social',
        status: 'Open',
        owner: 'Culture Team',
        audience: 'Open sign-up',
        summary: 'Cross-team kudos highlights and onboarding stories from recent hires.',
    },
    {
        id: 'real-onboarding-clinic',
        title: 'Onboarding Process Clinic',
        startsAt: '2026-03-11T08:00:00Z',
        startsOn: '2026-03-11',
        dateLabel: 'Wed, Mar 11',
        timeLabel: '10:00-11:30 EET',
        office: 'vilnius',
        locationLabel: 'Vilnius HQ, Atlas Room',
        type: 'learning',
        status: 'Completed',
        owner: 'HR Enablement',
        audience: 'Team leads',
        summary: 'Legacy-to-modern onboarding checklist dry run and policy refresh.',
    },
    {
        id: 'real-demo-readiness',
        title: 'Demo Readiness Sync',
        startsAt: '2026-03-08T14:00:00Z',
        startsOn: '2026-03-08',
        dateLabel: 'Sun, Mar 8',
        timeLabel: '16:00-16:45 EET',
        office: 'remote',
        locationLabel: 'Remote call',
        type: 'company',
        status: 'Completed',
        owner: 'Modernization Program',
        audience: 'Thread owners',
        summary: 'Final walkthrough rehearsal and route status alignment checkpoint.',
    },
    {
        id: 'real-volunteer-day',
        title: 'Spring Volunteer Day',
        startsAt: '2026-02-27T09:30:00Z',
        startsOn: '2026-02-27',
        dateLabel: 'Fri, Feb 27',
        timeLabel: '11:30-15:30 EET',
        office: 'kaunas',
        locationLabel: 'Kaunas Community Center',
        type: 'social',
        status: 'Completed',
        owner: 'People Ops',
        audience: 'Volunteer cohort',
        summary: 'Community support day with post-event recap and recognition.',
    },
];

const mockFixtures: EventFixture[] = [
    {
        id: 'mock-allhands-march',
        title: 'Monthly All-hands',
        startsAt: '2026-03-25T08:30:00Z',
        startsOn: '2026-03-25',
        dateLabel: 'Wed, Mar 25',
        timeLabel: '10:30-11:30 EET',
        office: 'vilnius',
        locationLabel: 'Vilnius HQ, Townhall Stage',
        type: 'company',
        status: 'Scheduled',
        owner: 'Executive Office',
        audience: 'All employees',
        summary: 'Deterministic all-hands fixture used in walkthrough rehearsals.',
    },
    {
        id: 'mock-testing-clinic',
        title: 'Testing Guild Clinic',
        startsAt: '2026-03-21T12:00:00Z',
        startsOn: '2026-03-21',
        dateLabel: 'Sat, Mar 21',
        timeLabel: '14:00-15:00 EET',
        office: 'kaunas',
        locationLabel: 'Kaunas Hub, Focus Room 3',
        type: 'learning',
        status: 'Open',
        owner: 'QA Guild',
        audience: 'QA + Frontend',
        summary: 'Contract-testing walkthrough with deterministic fixture examples.',
    },
    {
        id: 'mock-coffee-chat',
        title: 'Cross-team Coffee Chat',
        startsAt: '2026-03-16T09:00:00Z',
        startsOn: '2026-03-16',
        dateLabel: 'Mon, Mar 16',
        timeLabel: '11:00-11:45 EET',
        office: 'remote',
        locationLabel: 'Remote social room',
        type: 'social',
        status: 'Open',
        owner: 'People Team',
        audience: 'Open sign-up',
        summary: 'Informal intro session for teams joining the modernization demo.',
    },
    {
        id: 'mock-incident-playback',
        title: 'Incident Playback Session',
        startsAt: '2026-03-12T13:30:00Z',
        startsOn: '2026-03-12',
        dateLabel: 'Thu, Mar 12',
        timeLabel: '15:30-16:15 EET',
        office: 'vilnius',
        locationLabel: 'Vilnius HQ, Vega Room',
        type: 'learning',
        status: 'Completed',
        owner: 'Operations',
        audience: 'Ops + Platform',
        summary: 'Post-incident learning recap with follow-up action log snapshot.',
    },
    {
        id: 'mock-roadmap-review',
        title: 'Roadmap Review',
        startsAt: '2026-03-09T10:00:00Z',
        startsOn: '2026-03-09',
        dateLabel: 'Mon, Mar 9',
        timeLabel: '12:00-13:00 EET',
        office: 'remote',
        locationLabel: 'Remote product forum',
        type: 'company',
        status: 'Completed',
        owner: 'Product Leadership',
        audience: 'Cross-functional leads',
        summary: 'Planning checkpoint for route coverage and demo acceptance goals.',
    },
    {
        id: 'mock-charity-run',
        title: 'Charity Run Kickoff',
        startsAt: '2026-02-24T07:30:00Z',
        startsOn: '2026-02-24',
        dateLabel: 'Tue, Feb 24',
        timeLabel: '09:30-10:00 EET',
        office: 'kaunas',
        locationLabel: 'Kaunas Riverside Track',
        type: 'social',
        status: 'Completed',
        owner: 'Culture Ambassadors',
        audience: 'Volunteer cohort',
        summary: 'Community run kickoff fixture kept for deterministic past-event grouping.',
    },
];

const eventAdapters: Record<Extract<DataSource, 'real' | 'mock'>, () => EventFixture[]> = {
    real: () => realFixtures.map((event) => ({ ...event })),
    mock: () => mockFixtures.map((event) => ({ ...event })),
};

export const eventsExperienceNotes = {
    schedule:
        'Events route resolves through explicit real/mock adapters with deterministic fixture data and no write-side mutations.',
    widgets: 'Context widgets are read-only summaries derived from filtered event sections.',
} as const;

function normalizeFilters(params: EventsExperienceParams): EventsFilterState {
    return {
        timeframe: params.timeframe ?? defaultFilters.timeframe,
        office: params.office ?? defaultFilters.office,
        type: params.type ?? defaultFilters.type,
        sort: params.sort ?? defaultFilters.sort,
    };
}

function compareEventOrder(left: EventFixture, right: EventFixture, sort: EventsSortMode): number {
    if (sort === 'title') {
        return left.title.localeCompare(right.title);
    }

    if (sort === 'latest') {
        return right.startsAt.localeCompare(left.startsAt);
    }

    return left.startsAt.localeCompare(right.startsAt);
}

function matchesEventFilters(event: EventFixture, filters: EventsFilterState): boolean {
    if (filters.office !== 'all' && event.office !== filters.office) {
        return false;
    }

    if (filters.type !== 'all' && event.type !== filters.type) {
        return false;
    }

    return true;
}

function splitByTimeframe(items: EventFixture[]): { upcoming: EventFixture[]; past: EventFixture[] } {
    const upcoming: EventFixture[] = [];
    const past: EventFixture[] = [];

    for (const item of items) {
        if (item.startsOn >= eventsAnchorDate) {
            upcoming.push(item);
            continue;
        }

        past.push(item);
    }

    return { upcoming, past };
}

function toEventRecord(item: EventFixture): EventRecord {
    return {
        id: item.id,
        title: item.title,
        startsOn: item.startsOn,
        dateLabel: item.dateLabel,
        timeLabel: item.timeLabel,
        office: item.office,
        locationLabel: item.locationLabel,
        type: item.type,
        status: item.status,
        owner: item.owner,
        audience: item.audience,
        summary: item.summary,
    };
}

function resolveSection<TItem>(source: DataSource, items: TItem[]): EventsSectionState<TItem> {
    if (source === 'disabled') {
        return {
            kind: 'unavailable',
            adapter: source,
            reason: eventsDisabledReason,
        };
    }

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

function resolveUnavailableSection<TItem>(source: DataSource, reason: string): EventsSectionState<TItem> {
    return {
        kind: 'unavailable',
        adapter: source,
        reason,
    };
}

function toWidgetCards(
    filters: EventsFilterState,
    upcomingItems: EventRecord[],
    pastItems: EventRecord[],
): EventsWidgetCard[] {
    const nextEvent = upcomingItems[0];

    return [
        {
            id: 'events-widget-context',
            title: 'Context',
            rows: [
                {
                    id: 'events-context-timeframe',
                    label: 'Window',
                    value: eventsTimeframeOptions.find((option) => option.value === filters.timeframe)?.label ?? filters.timeframe,
                },
                {
                    id: 'events-context-office',
                    label: 'Office',
                    value: eventsOfficeOptions.find((option) => option.value === filters.office)?.label ?? filters.office,
                },
                {
                    id: 'events-context-sort',
                    label: 'Sort',
                    value: eventsSortOptions.find((option) => option.value === filters.sort)?.label ?? filters.sort,
                },
            ],
        },
        {
            id: 'events-widget-pulse',
            title: 'Schedule pulse',
            rows: [
                {
                    id: 'events-pulse-next',
                    label: 'Next event',
                    value: nextEvent ? `${nextEvent.title} (${nextEvent.dateLabel})` : 'No upcoming event for current filters',
                },
                {
                    id: 'events-pulse-upcoming',
                    label: 'Upcoming',
                    value: `${upcomingItems.length} item${upcomingItems.length === 1 ? '' : 's'}`,
                },
                {
                    id: 'events-pulse-past',
                    label: 'Past',
                    value: `${pastItems.length} item${pastItems.length === 1 ? '' : 's'}`,
                },
            ],
        },
        {
            id: 'events-widget-readonly',
            title: 'Read-only reminders',
            rows: [
                {
                    id: 'events-readonly-rsvp',
                    label: 'RSVP',
                    value: 'Displayed for parity only. Updates are disabled in this prototype.',
                },
                {
                    id: 'events-readonly-create',
                    label: 'Create/edit',
                    value: 'Deferred until write-path ADR and API contracts are approved.',
                },
            ],
        },
    ];
}

function toSummaryCards(upcomingCount: number, pastCount: number, nextEvent?: EventRecord): EventsSummaryCard[] {
    return [
        {
            label: 'Upcoming events',
            value: `${upcomingCount} scheduled`,
        },
        {
            label: 'Past events',
            value: `${pastCount} completed`,
        },
        {
            label: 'Next event',
            value: nextEvent ? `${nextEvent.title} · ${nextEvent.dateLabel}` : 'No upcoming events for current filters',
        },
    ];
}

export async function fetchEventsExperience(params: EventsExperienceParams = {}): Promise<EventsExperienceResult> {
    const filters = normalizeFilters(params);
    const dataSource = resolveDataSource('events');

    if (filters.type === 'external') {
        return {
            kind: 'eventsExperience',
            dataSource,
            filters,
            summaryCards: [
                { label: 'Upcoming events', value: 'Unavailable' },
                { label: 'Past events', value: 'Unavailable' },
                { label: 'Next event', value: 'External partner feed deferred' },
            ],
            upcoming: resolveUnavailableSection(dataSource, externalEventsDeferredReason),
            past: resolveUnavailableSection(dataSource, externalEventsDeferredReason),
            widgets: resolveUnavailableSection(dataSource, externalEventsDeferredReason),
            notes: eventsExperienceNotes,
        };
    }

    if (dataSource === 'disabled') {
        return {
            kind: 'eventsExperience',
            dataSource,
            filters,
            summaryCards: [
                { label: 'Upcoming events', value: 'Unavailable' },
                { label: 'Past events', value: 'Unavailable' },
                { label: 'Next event', value: 'Events source disabled' },
            ],
            upcoming: resolveUnavailableSection(dataSource, eventsDisabledReason),
            past: resolveUnavailableSection(dataSource, eventsDisabledReason),
            widgets: resolveUnavailableSection(dataSource, eventsDisabledReason),
            notes: eventsExperienceNotes,
        };
    }

    const fixtureItems = eventAdapters[dataSource]()
        .filter((item) => matchesEventFilters(item, filters))
        .sort((left, right) => compareEventOrder(left, right, filters.sort));

    const splitItems = splitByTimeframe(fixtureItems);

    const upcomingItems = filters.timeframe === 'past' ? [] : splitItems.upcoming.map((item) => toEventRecord(item));
    const pastItems = filters.timeframe === 'upcoming' ? [] : splitItems.past.map((item) => toEventRecord(item));

    const summaryCards = toSummaryCards(upcomingItems.length, pastItems.length, upcomingItems[0]);
    const widgetCards = toWidgetCards(filters, upcomingItems, pastItems);

    return {
        kind: 'eventsExperience',
        dataSource,
        filters,
        summaryCards,
        upcoming: resolveSection(dataSource, upcomingItems),
        past: resolveSection(dataSource, pastItems),
        widgets: resolveSection(dataSource, widgetCards),
        notes: eventsExperienceNotes,
    };
}
