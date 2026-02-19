import { useEffect, useState } from 'react';
import {
    fetchKudosExperience,
    kudosPeriodOptions,
    kudosTeamOptions,
    kudosTypeOptions,
    type KudosDistributionRow,
    type KudosExperienceResult,
    type KudosFeedItem,
    type KudosPeriodFilter,
    type KudosSectionState,
    type KudosTeamFilter,
    type KudosTypeFilter,
} from '../api/kudosExperience';
import { CardChrome, ListRow, SectionHeader } from '../app/ui/primitives';

function formatSourceLabel(dataSource: KudosExperienceResult['dataSource']): string {
    if (dataSource === 'real') {
        return 'real API';
    }

    if (dataSource === 'mock') {
        return 'mock fixtures';
    }

    return 'disabled';
}

function renderFeedSection(state: KudosSectionState<KudosFeedItem> | undefined) {
    if (!state) {
        return (
            <CardChrome as="section" className="kudos-state-card" data-testid="kudos-feed-loading" role="status">
                <h2>Kudos feed</h2>
                <p>Loading kudos feed...</p>
            </CardChrome>
        );
    }

    if (state.kind === 'unavailable') {
        return (
            <CardChrome as="section" className="kudos-state-card" data-testid="kudos-feed-unavailable" role="alert" tone="warning">
                <h2>Kudos feed unavailable</h2>
                <p>{state.reason}</p>
            </CardChrome>
        );
    }

    if (state.kind === 'empty') {
        return (
            <CardChrome as="section" className="kudos-state-card" data-testid="kudos-feed-empty" role="status">
                <h2>Kudos feed</h2>
                <p>No kudos entries match the selected period/type/team filters.</p>
            </CardChrome>
        );
    }

    return (
        <section aria-label="Kudos feed" className="kudos-feed-list" data-testid="kudos-feed-success">
            <header className="kudos-feed-header">
                <h2>Kudos feed</h2>
                <p>{state.items.length} entries</p>
            </header>
            <div className="kudos-feed-stack">
                {state.items.map((item) => (
                    <CardChrome as="article" className="kudos-feed-item" data-testid="kudos-feed-item" key={item.id}>
                        <header className="kudos-feed-item-header">
                            <p className="kudos-feed-item-people">
                                <span>{item.sender}</span>
                                <span className="kudos-feed-arrow" aria-hidden="true">
                                    {'->'}
                                </span>
                                <span>{item.receiver}</span>
                            </p>
                            <p className="kudos-feed-item-date">{item.dateLabel}</p>
                        </header>
                        <p className="kudos-feed-item-meta">
                            {item.team} · {item.type}
                        </p>
                        <p className="kudos-feed-item-message">{item.message}</p>
                    </CardChrome>
                ))}
            </div>
        </section>
    );
}

function renderLeaderboardSection(state: KudosSectionState<{ receiver: string; team: string; count: number }> | undefined) {
    if (!state) {
        return (
            <CardChrome as="section" className="kudos-state-card" data-testid="kudos-leaderboard-loading" role="status">
                <h2>Leaderboard</h2>
                <p>Loading leaderboard...</p>
            </CardChrome>
        );
    }

    if (state.kind === 'unavailable') {
        return (
            <CardChrome
                as="section"
                className="kudos-state-card"
                data-testid="kudos-leaderboard-unavailable"
                role="alert"
                tone="warning"
            >
                <h2>Leaderboard unavailable</h2>
                <p>{state.reason}</p>
            </CardChrome>
        );
    }

    if (state.kind === 'empty') {
        return (
            <CardChrome as="section" className="kudos-state-card" data-testid="kudos-leaderboard-empty" role="status">
                <h2>Leaderboard</h2>
                <p>No leaderboard rows are available for current filters.</p>
            </CardChrome>
        );
    }

    return (
        <CardChrome as="section" className="kudos-side-card" data-testid="kudos-leaderboard-success">
            <header className="kudos-side-header">
                <h2>Leaderboard</h2>
            </header>
            <ul>
                {state.items.map((row) => (
                    <ListRow className="kudos-side-row" data-testid="kudos-leader-row" key={row.receiver}>
                        <span className="kudos-side-primary">{row.receiver}</span>
                        <span className="kudos-side-secondary">{row.team}</span>
                        <span className="kudos-side-count">{row.count}</span>
                    </ListRow>
                ))}
            </ul>
        </CardChrome>
    );
}

function renderDistributionSection(state: KudosSectionState<KudosDistributionRow> | undefined) {
    if (!state) {
        return (
            <CardChrome as="section" className="kudos-state-card" data-testid="kudos-distribution-loading" role="status">
                <h2>Type distribution</h2>
                <p>Loading distribution...</p>
            </CardChrome>
        );
    }

    if (state.kind === 'unavailable') {
        return (
            <CardChrome
                as="section"
                className="kudos-state-card"
                data-testid="kudos-distribution-unavailable"
                role="alert"
                tone="warning"
            >
                <h2>Type distribution unavailable</h2>
                <p>{state.reason}</p>
            </CardChrome>
        );
    }

    if (state.kind === 'empty') {
        return (
            <CardChrome as="section" className="kudos-state-card" data-testid="kudos-distribution-empty" role="status">
                <h2>Type distribution</h2>
                <p>No kudos distribution rows are available for current filters.</p>
            </CardChrome>
        );
    }

    return (
        <CardChrome as="section" className="kudos-side-card" data-testid="kudos-distribution-success">
            <header className="kudos-side-header">
                <h2>Type distribution</h2>
            </header>
            <ul>
                {state.items.map((row) => (
                    <ListRow className="kudos-side-row" data-testid="kudos-distribution-row" key={row.id}>
                        <span className="kudos-side-primary">{row.type}</span>
                        <span className="kudos-side-count">{row.count}</span>
                    </ListRow>
                ))}
            </ul>
        </CardChrome>
    );
}

export function KudosPage() {
    const [period, setPeriod] = useState<KudosPeriodFilter>('quarter-to-date');
    const [type, setType] = useState<KudosTypeFilter>('all');
    const [team, setTeam] = useState<KudosTeamFilter>('all');
    const [result, setResult] = useState<KudosExperienceResult | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadKudos() {
            const response = await fetchKudosExperience({ period, type, team });

            if (!isMounted) {
                return;
            }

            setResult(response);
        }

        void loadKudos();

        return () => {
            isMounted = false;
        };
    }, [period, team, type]);

    const sourceSummary = result ? `Data source: ${formatSourceLabel(result.dataSource)}` : undefined;

    return (
        <section aria-label="Kudos page" className="kudos-page" data-testid="kudos-page">
            <SectionHeader
                className="kudos-page-header"
                meta={sourceSummary ? <span data-testid="kudos-data-source-summary">{sourceSummary}</span> : undefined}
                metaClassName="kudos-source-meta"
                subtitle="Dense recognition feed with deterministic filtering and read-only giveaway controls."
                subtitleClassName="kudos-page-subtitle"
                title="Kudos"
                titleAs="h1"
                titleClassName="page-title"
            />
            <CardChrome as="section" className="kudos-controls" data-testid="kudos-controls">
                <header className="kudos-controls-header">
                    <h2>Kudos filters</h2>
                    <button className="kudos-give-cta" data-testid="kudos-give-cta" disabled type="button">
                        Give Kudos
                    </button>
                </header>
                <p className="kudos-controls-note">Submission and category management are deferred; this route remains read-first.</p>
                <div className="kudos-controls-grid">
                    <label htmlFor="kudos-period-select">
                        <span>Period</span>
                        <select
                            data-testid="kudos-period-select"
                            id="kudos-period-select"
                            onChange={(event) => {
                                setPeriod(event.target.value as KudosPeriodFilter);
                            }}
                            value={period}
                        >
                            {kudosPeriodOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label htmlFor="kudos-type-select">
                        <span>Type</span>
                        <select
                            data-testid="kudos-type-select"
                            id="kudos-type-select"
                            onChange={(event) => {
                                setType(event.target.value as KudosTypeFilter);
                            }}
                            value={type}
                        >
                            {kudosTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label htmlFor="kudos-team-select">
                        <span>Team</span>
                        <select
                            data-testid="kudos-team-select"
                            id="kudos-team-select"
                            onChange={(event) => {
                                setTeam(event.target.value as KudosTeamFilter);
                            }}
                            value={team}
                        >
                            {kudosTeamOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <p className="kudos-filter-summary" data-testid="kudos-filter-summary">
                    Active controls: {period}, {type}, {team}.
                </p>
            </CardChrome>
            <dl className="kudos-summary-grid" data-testid="kudos-summary-grid">
                {(result?.summaryCards ?? [
                    { label: 'Kudos in scope', value: 'Loading...' },
                    { label: 'Unique senders', value: 'Loading...' },
                    { label: 'Most thanked', value: 'Loading...' },
                ]).map((card) => (
                    <CardChrome as="div" className="kudos-summary-card" key={card.label}>
                        <dt>{card.label}</dt>
                        <dd>{card.value}</dd>
                    </CardChrome>
                ))}
            </dl>
            <div className="kudos-layout-grid">
                <section className="kudos-main-column">{renderFeedSection(result?.feed)}</section>
                <aside className="kudos-side-column">
                    {renderLeaderboardSection(result?.leaderboard)}
                    {renderDistributionSection(result?.distribution)}
                </aside>
            </div>
        </section>
    );
}
