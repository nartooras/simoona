import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import {
    eventsOfficeOptions,
    eventsSortOptions,
    eventsTimeframeOptions,
    eventsTypeOptions,
    fetchEventsExperience,
    type EventRecord,
    type EventsExperienceResult,
    type EventsOfficeFilter,
    type EventsSectionState,
    type EventsSortMode,
    type EventsTimeframeFilter,
    type EventsTypeFilter,
    type EventsWidgetCard,
} from '../api/eventsExperience';
import { CardChrome, ListRow, SectionHeader } from '../app/ui/primitives';

function formatSourceLabel(dataSource: EventsExperienceResult['dataSource']): string {
    if (dataSource === 'real') {
        return 'real API';
    }

    if (dataSource === 'mock') {
        return 'mock fixtures';
    }

    return 'disabled';
}

function renderEventSection(
    title: string,
    loadingMessage: string,
    state: EventsSectionState<EventRecord> | undefined,
    emptyMessage: string,
    testIdPrefix: 'events-upcoming' | 'events-past',
    expandedByEventId: Record<string, boolean>,
    setExpandedByEventId: Dispatch<SetStateAction<Record<string, boolean>>>,
) {
    if (!state) {
        return (
            <CardChrome as="section" className="events-state-card" data-testid={`${testIdPrefix}-loading`} role="status">
                <h3>{title}</h3>
                <p>{loadingMessage}</p>
            </CardChrome>
        );
    }

    if (state.kind === 'unavailable') {
        return (
            <CardChrome as="section" className="events-state-card" data-testid={`${testIdPrefix}-unavailable`} role="alert" tone="warning">
                <h3>{title} unavailable</h3>
                <p>{state.reason}</p>
            </CardChrome>
        );
    }

    if (state.kind === 'empty') {
        return (
            <CardChrome as="section" className="events-state-card" data-testid={`${testIdPrefix}-empty`} role="status">
                <h3>{title}</h3>
                <p>{emptyMessage}</p>
            </CardChrome>
        );
    }

    return (
        <section aria-label={title} className="events-section-list" data-testid={`${testIdPrefix}-success`}>
            <header className="events-section-header">
                <h2>{title}</h2>
                <p>{state.items.length} item{state.items.length === 1 ? '' : 's'}</p>
            </header>
            <div className="events-card-stack">
                {state.items.map((event) => {
                    const detailsVisible = expandedByEventId[event.id] ?? false;

                    return (
                        <CardChrome as="article" className="event-card" data-testid="event-card" key={event.id}>
                            <header className="event-card-header">
                                <div>
                                    <p className="event-card-date">{event.dateLabel}</p>
                                    <h3 className="event-card-title">{event.title}</h3>
                                </div>
                                <span className={`event-card-status event-card-status--${event.status.toLowerCase()}`}>
                                    {event.status}
                                </span>
                            </header>
                            <p className="event-card-time-location">
                                {event.timeLabel} · {event.locationLabel}
                            </p>
                            <p className="event-card-meta">
                                Audience: {event.audience} · Owner: {event.owner}
                            </p>
                            <div className="event-card-actions">
                                <button
                                    aria-expanded={detailsVisible}
                                    className="event-card-toggle"
                                    data-testid={`event-details-toggle-${event.id}`}
                                    onClick={() => {
                                        setExpandedByEventId((current) => ({
                                            ...current,
                                            [event.id]: !(current[event.id] ?? false),
                                        }));
                                    }}
                                    type="button"
                                >
                                    {detailsVisible ? 'Hide details' : 'View details'}
                                </button>
                            </div>
                            {detailsVisible ? (
                                <p className="event-card-summary" data-testid={`event-details-${event.id}`}>
                                    {event.summary}
                                </p>
                            ) : null}
                        </CardChrome>
                    );
                })}
            </div>
        </section>
    );
}

function renderWidgetSection(
    state: EventsSectionState<EventsWidgetCard> | undefined,
    loadingMessage: string,
    emptyMessage: string,
) {
    if (!state) {
        return (
            <CardChrome as="section" className="events-state-card" data-testid="events-widgets-loading" role="status">
                <h2>Context widgets</h2>
                <p>{loadingMessage}</p>
            </CardChrome>
        );
    }

    if (state.kind === 'unavailable') {
        return (
            <CardChrome as="section" className="events-state-card" data-testid="events-widgets-unavailable" role="alert" tone="warning">
                <h2>Context widgets unavailable</h2>
                <p>{state.reason}</p>
            </CardChrome>
        );
    }

    if (state.kind === 'empty') {
        return (
            <CardChrome as="section" className="events-state-card" data-testid="events-widgets-empty" role="status">
                <h2>Context widgets</h2>
                <p>{emptyMessage}</p>
            </CardChrome>
        );
    }

    return (
        <div className="events-widget-stack" data-testid="events-widgets-success">
            {state.items.map((card) => (
                <CardChrome as="section" className="events-widget-card" data-testid="events-widget-card" key={card.id}>
                    <header className="events-widget-header">
                        <h2>{card.title}</h2>
                    </header>
                    <ul>
                        {card.rows.map((row) => (
                            <ListRow className="events-widget-row" data-testid="events-widget-row" key={row.id}>
                                <span className="events-widget-row-label">{row.label}</span>
                                <span className="events-widget-row-value">{row.value}</span>
                            </ListRow>
                        ))}
                    </ul>
                </CardChrome>
            ))}
        </div>
    );
}

export function EventsPage() {
    const [timeframe, setTimeframe] = useState<EventsTimeframeFilter>('all');
    const [office, setOffice] = useState<EventsOfficeFilter>('all');
    const [type, setType] = useState<EventsTypeFilter>('all');
    const [sort, setSort] = useState<EventsSortMode>('soonest');
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState<EventsExperienceResult | null>(null);
    const [expandedByEventId, setExpandedByEventId] = useState<Record<string, boolean>>({});

    useEffect(() => {
        let isMounted = true;

        async function loadEvents() {
            setIsLoading(true);

            const response = await fetchEventsExperience({
                timeframe,
                office,
                type,
                sort,
            });

            if (!isMounted) {
                return;
            }

            setResult(response);
            setIsLoading(false);
        }

        void loadEvents();

        return () => {
            isMounted = false;
        };
    }, [office, sort, timeframe, type]);

    useEffect(() => {
        if (!result) {
            return;
        }

        const nextExpandedByEventId: Record<string, boolean> = {};

        if (result.upcoming.kind === 'success') {
            for (const event of result.upcoming.items) {
                nextExpandedByEventId[event.id] = false;
            }
        }

        if (result.past.kind === 'success') {
            for (const event of result.past.items) {
                nextExpandedByEventId[event.id] = false;
            }
        }

        setExpandedByEventId(nextExpandedByEventId);
    }, [result]);

    const sourceSummary = result ? `Data source: ${formatSourceLabel(result.dataSource)}` : undefined;

    return (
        <section aria-label="Events page" className="events-page" data-testid="events-page">
            <SectionHeader
                className="events-page-header"
                meta={sourceSummary ? <span data-testid="events-data-source-summary">{sourceSummary}</span> : undefined}
                metaClassName="events-source-meta"
                subtitle="Legacy-like event discovery with deterministic list grouping, contextual widgets, and read-only controls."
                subtitleClassName="events-page-subtitle"
                title="Events"
                titleAs="h1"
                titleClassName="page-title"
            />
            <CardChrome as="section" className="events-controls" data-testid="events-controls">
                <header className="events-controls-header">
                    <h2>Schedule controls</h2>
                    <button className="events-create-cta" data-testid="events-create-cta" disabled type="button">
                        Create Event
                    </button>
                </header>
                <p className="events-controls-note">Create/edit and RSVP updates remain disabled in this read-first prototype.</p>
                <div className="events-controls-grid">
                    <label htmlFor="events-timeframe-select">
                        <span>Window</span>
                        <select
                            data-testid="events-timeframe-select"
                            id="events-timeframe-select"
                            onChange={(event) => {
                                setTimeframe(event.target.value as EventsTimeframeFilter);
                            }}
                            value={timeframe}
                        >
                            {eventsTimeframeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label htmlFor="events-office-select">
                        <span>Office</span>
                        <select
                            data-testid="events-office-select"
                            id="events-office-select"
                            onChange={(event) => {
                                setOffice(event.target.value as EventsOfficeFilter);
                            }}
                            value={office}
                        >
                            {eventsOfficeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label htmlFor="events-type-select">
                        <span>Type</span>
                        <select
                            data-testid="events-type-select"
                            id="events-type-select"
                            onChange={(event) => {
                                setType(event.target.value as EventsTypeFilter);
                            }}
                            value={type}
                        >
                            {eventsTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label htmlFor="events-sort-select">
                        <span>Sort</span>
                        <select
                            data-testid="events-sort-select"
                            id="events-sort-select"
                            onChange={(event) => {
                                setSort(event.target.value as EventsSortMode);
                            }}
                            value={sort}
                        >
                            {eventsSortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <p className="events-filter-summary" data-testid="events-filter-summary">
                    Active controls: {timeframe}, {office}, {type}, {sort}.
                </p>
            </CardChrome>
            <dl className="events-summary-grid" data-testid="events-summary-grid">
                {(result?.summaryCards ?? [
                    { label: 'Upcoming events', value: 'Loading...' },
                    { label: 'Past events', value: 'Loading...' },
                    { label: 'Next event', value: 'Loading...' },
                ]).map((card) => (
                    <CardChrome as="div" className="events-summary-card" key={card.label}>
                        <dt>{card.label}</dt>
                        <dd>{card.value}</dd>
                    </CardChrome>
                ))}
            </dl>
            <div className="events-layout-grid">
                <section aria-label="Event groups" className="events-main-column">
                    {isLoading && !result
                        ? renderEventSection(
                              'Upcoming',
                              'Loading upcoming events...',
                              undefined,
                              'No upcoming events match your current filters.',
                              'events-upcoming',
                              expandedByEventId,
                              setExpandedByEventId,
                          )
                        : renderEventSection(
                              'Upcoming',
                              'Loading upcoming events...',
                              result?.upcoming,
                              'No upcoming events match your current filters.',
                              'events-upcoming',
                              expandedByEventId,
                              setExpandedByEventId,
                          )}
                    {isLoading && !result
                        ? renderEventSection(
                              'Past',
                              'Loading past events...',
                              undefined,
                              'No past events match your current filters.',
                              'events-past',
                              expandedByEventId,
                              setExpandedByEventId,
                          )
                        : renderEventSection(
                              'Past',
                              'Loading past events...',
                              result?.past,
                              'No past events match your current filters.',
                              'events-past',
                              expandedByEventId,
                              setExpandedByEventId,
                          )}
                </section>
                <aside aria-label="Events contextual widgets" className="events-side-column">
                    {isLoading && !result
                        ? renderWidgetSection(undefined, 'Loading contextual widgets...', 'No widgets are available for this selection.')
                        : renderWidgetSection(
                              result?.widgets,
                              'Loading contextual widgets...',
                              'No widgets are available for this selection.',
                          )}
                </aside>
            </div>
        </section>
    );
}
