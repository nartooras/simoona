import { resolveDataSource, type DataSource } from './dataSource';

export type KudosPeriodFilter = 'last-30-days' | 'quarter-to-date' | 'year-to-date';
export type KudosTypeFilter = 'all' | 'teamwork' | 'leadership' | 'innovation' | 'external';
export type KudosTeamFilter = 'all' | 'engineering' | 'people' | 'support' | 'sales' | 'finance';

export interface KudosFilterState {
    period: KudosPeriodFilter;
    type: KudosTypeFilter;
    team: KudosTeamFilter;
}

export type KudosExperienceParams = Partial<KudosFilterState>;

export interface KudosOption<TValue extends string> {
    value: TValue;
    label: string;
}

export const kudosPeriodOptions: ReadonlyArray<KudosOption<KudosPeriodFilter>> = [
    { value: 'last-30-days', label: 'Last 30 days' },
    { value: 'quarter-to-date', label: 'Quarter to date' },
    { value: 'year-to-date', label: 'Year to date' },
];

export const kudosTypeOptions: ReadonlyArray<KudosOption<KudosTypeFilter>> = [
    { value: 'all', label: 'All kudos types' },
    { value: 'teamwork', label: 'Teamwork' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'innovation', label: 'Innovation' },
    { value: 'external', label: 'External recognition (deferred)' },
];

export const kudosTeamOptions: ReadonlyArray<KudosOption<KudosTeamFilter>> = [
    { value: 'all', label: 'All teams' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'people', label: 'People Ops' },
    { value: 'support', label: 'Support' },
    { value: 'sales', label: 'Sales' },
    { value: 'finance', label: 'Finance (demo-empty)' },
];

export interface KudosFeedItem {
    id: string;
    sentOn: string;
    dateLabel: string;
    sender: string;
    receiver: string;
    team: Exclude<KudosTeamFilter, 'all' | 'finance'>;
    type: Exclude<KudosTypeFilter, 'all' | 'external'>;
    message: string;
}

export interface KudosLeaderboardRow {
    id: string;
    receiver: string;
    team: string;
    count: number;
}

export interface KudosDistributionRow {
    id: string;
    type: string;
    count: number;
}

export interface KudosSummaryCard {
    label: string;
    value: string;
}

export type KudosSectionState<TItem> =
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

export interface KudosExperienceResult {
    kind: 'kudosExperience';
    dataSource: DataSource;
    filters: KudosFilterState;
    summaryCards: KudosSummaryCard[];
    feed: KudosSectionState<KudosFeedItem>;
    leaderboard: KudosSectionState<KudosLeaderboardRow>;
    distribution: KudosSectionState<KudosDistributionRow>;
    notes: {
        feed: string;
        leaderboard: string;
    };
}

const defaultFilters: KudosFilterState = {
    period: 'quarter-to-date',
    type: 'all',
    team: 'all',
};

const kudosAnchorDate = '2026-08-15';
const externalKudosDeferredReason =
    'External recognition submissions are deferred in this prototype. Internal kudos history remains read-only.';
const kudosDisabledReason = 'Kudos source is currently unavailable in this prototype environment.';

const realFeedFixtures: KudosFeedItem[] = [
    {
        id: 'real-kudos-1',
        sentOn: '2026-08-13',
        dateLabel: 'Aug 13, 2026',
        sender: 'Monika V.',
        receiver: 'Rokas P.',
        team: 'engineering',
        type: 'innovation',
        message: 'Thanks for pushing deterministic test fixtures across the migration pack.',
    },
    {
        id: 'real-kudos-2',
        sentOn: '2026-08-11',
        dateLabel: 'Aug 11, 2026',
        sender: 'Egle J.',
        receiver: 'Tomas G.',
        team: 'support',
        type: 'teamwork',
        message: 'Great collaboration with support and platform during release rehearsal.',
    },
    {
        id: 'real-kudos-3',
        sentOn: '2026-08-02',
        dateLabel: 'Aug 2, 2026',
        sender: 'Rasa D.',
        receiver: 'Lina M.',
        team: 'people',
        type: 'leadership',
        message: 'Clear guidance on rollout communications and stakeholder updates.',
    },
    {
        id: 'real-kudos-4',
        sentOn: '2026-07-29',
        dateLabel: 'Jul 29, 2026',
        sender: 'Simas A.',
        receiver: 'Rokas P.',
        team: 'engineering',
        type: 'teamwork',
        message: 'Excellent pairing on route metadata cleanup and smoke coverage.',
    },
    {
        id: 'real-kudos-5',
        sentOn: '2026-07-18',
        dateLabel: 'Jul 18, 2026',
        sender: 'Mantas T.',
        receiver: 'Ieva K.',
        team: 'sales',
        type: 'leadership',
        message: 'Strong handoff quality that made the demo rehearsal predictable.',
    },
    {
        id: 'real-kudos-6',
        sentOn: '2026-05-21',
        dateLabel: 'May 21, 2026',
        sender: 'Aiste B.',
        receiver: 'Rokas P.',
        team: 'engineering',
        type: 'innovation',
        message: 'Shared a reusable adapter strategy for mock and real boundaries.',
    },
];

const mockFeedFixtures: KudosFeedItem[] = [
    {
        id: 'mock-kudos-1',
        sentOn: '2026-08-14',
        dateLabel: 'Aug 14, 2026',
        sender: 'Demo Moderator',
        receiver: 'Inga P.',
        team: 'engineering',
        type: 'teamwork',
        message: 'Kept Events and Kudos walkthrough deterministic through every rehearsal run.',
    },
    {
        id: 'mock-kudos-2',
        sentOn: '2026-08-09',
        dateLabel: 'Aug 9, 2026',
        sender: 'People Ops',
        receiver: 'Mantas R.',
        team: 'people',
        type: 'leadership',
        message: 'Aligned route messaging with stakeholder-ready demo notes.',
    },
    {
        id: 'mock-kudos-3',
        sentOn: '2026-08-04',
        dateLabel: 'Aug 4, 2026',
        sender: 'Support Captain',
        receiver: 'Tadas J.',
        team: 'support',
        type: 'teamwork',
        message: 'Handled cross-team checks and surfaced clear fallback states.',
    },
    {
        id: 'mock-kudos-4',
        sentOn: '2026-07-25',
        dateLabel: 'Jul 25, 2026',
        sender: 'Architecture Guild',
        receiver: 'Inga P.',
        team: 'engineering',
        type: 'innovation',
        message: 'Set up clean adapter boundaries with deterministic fixture versions.',
    },
    {
        id: 'mock-kudos-5',
        sentOn: '2026-07-19',
        dateLabel: 'Jul 19, 2026',
        sender: 'Sales Lead',
        receiver: 'Tomas V.',
        team: 'sales',
        type: 'leadership',
        message: 'Documented what works now versus deferred flow in concise demo terms.',
    },
    {
        id: 'mock-kudos-6',
        sentOn: '2026-06-02',
        dateLabel: 'Jun 2, 2026',
        sender: 'QA Coach',
        receiver: 'Mantas R.',
        team: 'people',
        type: 'teamwork',
        message: 'Expanded route tests for non-empty and unavailable state contracts.',
    },
];

const kudosFeedAdapters: Record<Extract<DataSource, 'real' | 'mock'>, () => KudosFeedItem[]> = {
    real: () => realFeedFixtures.map((item) => ({ ...item })),
    mock: () => mockFeedFixtures.map((item) => ({ ...item })),
};

export const kudosExperienceNotes = {
    feed: 'Kudos feed resolves through explicit real/mock adapters with deterministic read-only fixtures.',
    leaderboard: 'Leaderboard and distribution are derived from filtered kudos feed data and stay non-persistent.',
} as const;

function normalizeFilters(params: KudosExperienceParams): KudosFilterState {
    return {
        period: params.period ?? defaultFilters.period,
        type: params.type ?? defaultFilters.type,
        team: params.team ?? defaultFilters.team,
    };
}

function resolvePeriodStart(period: KudosPeriodFilter): string {
    if (period === 'last-30-days') {
        return '2026-07-16';
    }

    if (period === 'quarter-to-date') {
        return '2026-07-01';
    }

    return '2026-01-01';
}

function resolveSection<TItem>(source: DataSource, items: TItem[]): KudosSectionState<TItem> {
    if (source === 'disabled') {
        return {
            kind: 'unavailable',
            adapter: source,
            reason: kudosDisabledReason,
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

function resolveUnavailableSection<TItem>(source: DataSource, reason: string): KudosSectionState<TItem> {
    return {
        kind: 'unavailable',
        adapter: source,
        reason,
    };
}

function matchesFilters(item: KudosFeedItem, filters: KudosFilterState): boolean {
    const periodStart = resolvePeriodStart(filters.period);

    if (item.sentOn < periodStart || item.sentOn > kudosAnchorDate) {
        return false;
    }

    if (filters.type !== 'all' && item.type !== filters.type) {
        return false;
    }

    if (filters.team !== 'all' && item.team !== filters.team) {
        return false;
    }

    return true;
}

function buildLeaderboard(items: KudosFeedItem[]): KudosLeaderboardRow[] {
    const byReceiver = new Map<string, { receiver: string; team: string; count: number; lastSentOn: string }>();

    for (const item of items) {
        const key = `${item.receiver}|${item.team}`;
        const current = byReceiver.get(key);

        if (!current) {
            byReceiver.set(key, {
                receiver: item.receiver,
                team: item.team,
                count: 1,
                lastSentOn: item.sentOn,
            });
            continue;
        }

        current.count += 1;
        if (item.sentOn > current.lastSentOn) {
            current.lastSentOn = item.sentOn;
        }
    }

    return [...byReceiver.values()]
        .sort((left, right) => {
            if (left.count !== right.count) {
                return right.count - left.count;
            }

            if (left.lastSentOn !== right.lastSentOn) {
                return right.lastSentOn.localeCompare(left.lastSentOn);
            }

            return left.receiver.localeCompare(right.receiver);
        })
        .slice(0, 5)
        .map((entry) => ({
            id: `kudos-leader-${entry.receiver.toLowerCase().replace(/\s+/g, '-')}`,
            receiver: entry.receiver,
            team: entry.team,
            count: entry.count,
        }));
}

function buildDistribution(items: KudosFeedItem[]): KudosDistributionRow[] {
    const orderedTypes: Array<KudosFeedItem['type']> = ['teamwork', 'leadership', 'innovation'];

    return orderedTypes
        .map((type) => {
            const count = items.filter((item) => item.type === type).length;

            return {
                id: `kudos-distribution-${type}`,
                type,
                count,
            };
        })
        .filter((entry) => entry.count > 0);
}

function toSummaryCards(items: KudosFeedItem[], leaderboard: KudosLeaderboardRow[]): KudosSummaryCard[] {
    const uniqueSenders = new Set(items.map((item) => item.sender));
    const topReceiver = leaderboard[0];

    return [
        {
            label: 'Kudos in scope',
            value: `${items.length} entries`,
        },
        {
            label: 'Unique senders',
            value: `${uniqueSenders.size} teammates`,
        },
        {
            label: 'Most thanked',
            value: topReceiver ? `${topReceiver.receiver} (${topReceiver.count})` : 'No kudos in current scope',
        },
    ];
}

export async function fetchKudosExperience(params: KudosExperienceParams = {}): Promise<KudosExperienceResult> {
    const filters = normalizeFilters(params);
    const dataSource = resolveDataSource('kudos');

    if (filters.type === 'external') {
        return {
            kind: 'kudosExperience',
            dataSource,
            filters,
            summaryCards: [
                { label: 'Kudos in scope', value: 'Unavailable' },
                { label: 'Unique senders', value: 'Unavailable' },
                { label: 'Most thanked', value: 'External feed deferred' },
            ],
            feed: resolveUnavailableSection(dataSource, externalKudosDeferredReason),
            leaderboard: resolveUnavailableSection(dataSource, externalKudosDeferredReason),
            distribution: resolveUnavailableSection(dataSource, externalKudosDeferredReason),
            notes: kudosExperienceNotes,
        };
    }

    if (dataSource === 'disabled') {
        return {
            kind: 'kudosExperience',
            dataSource,
            filters,
            summaryCards: [
                { label: 'Kudos in scope', value: 'Unavailable' },
                { label: 'Unique senders', value: 'Unavailable' },
                { label: 'Most thanked', value: 'Kudos source disabled' },
            ],
            feed: resolveUnavailableSection(dataSource, kudosDisabledReason),
            leaderboard: resolveUnavailableSection(dataSource, kudosDisabledReason),
            distribution: resolveUnavailableSection(dataSource, kudosDisabledReason),
            notes: kudosExperienceNotes,
        };
    }

    const feedItems = kudosFeedAdapters[dataSource]()
        .filter((item) => matchesFilters(item, filters))
        .sort((left, right) => right.sentOn.localeCompare(left.sentOn) || left.id.localeCompare(right.id));

    const leaderboard = buildLeaderboard(feedItems);
    const distribution = buildDistribution(feedItems);

    return {
        kind: 'kudosExperience',
        dataSource,
        filters,
        summaryCards: toSummaryCards(feedItems, leaderboard),
        feed: resolveSection(dataSource, feedItems),
        leaderboard: resolveSection(dataSource, leaderboard),
        distribution: resolveSection(dataSource, distribution),
        notes: kudosExperienceNotes,
    };
}
