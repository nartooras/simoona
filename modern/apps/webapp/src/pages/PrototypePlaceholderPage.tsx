import { useId } from 'react';
import { CardChrome, ListRow, SectionHeader, StatusBadge } from '../app/ui/primitives';

interface PrototypePlaceholderPageProps {
    title: string;
    summary: string;
    dataSource: 'mock' | 'disabled' | 'real';
    cards: ReadonlyArray<{
        title: string;
        value: string;
    }>;
    availableNow: ReadonlyArray<string>;
    unavailableInPrototype: ReadonlyArray<string>;
    plannedNextWave: ReadonlyArray<string>;
    actions: ReadonlyArray<{
        label: string;
        explanation: string;
    }>;
    table?: {
        title: string;
        columns: ReadonlyArray<string>;
        rows: ReadonlyArray<ReadonlyArray<string>>;
    };
}

function renderChecklist(title: string, entries: ReadonlyArray<string>) {
    return (
        <CardChrome as="section" className="placeholder-state-block">
            <h2>{title}</h2>
            <ul>
                {entries.map((entry) => (
                    <ListRow key={entry} withSeparator={false}>
                        {entry}
                    </ListRow>
                ))}
            </ul>
        </CardChrome>
    );
}

const dataSourceLabels = {
    real: 'Real API',
    mock: 'Mock fixtures',
    disabled: 'Disabled',
} as const;

export function PrototypePlaceholderPage({
    title,
    summary,
    dataSource,
    cards,
    availableNow,
    unavailableInPrototype,
    plannedNextWave,
    actions,
    table,
}: PrototypePlaceholderPageProps) {
    const sectionTitleId = useId();

    return (
        <section aria-labelledby={sectionTitleId} className="page-section">
            <SectionHeader
                className="page-header-block"
                subtitle={
                    <span>
                        {summary}{' '}
                        <strong>
                            Data source: <StatusBadge className="page-data-source-badge" label={dataSourceLabels[dataSource]} mode={dataSource} />.
                        </strong>
                    </span>
                }
                subtitleClassName="status-message"
                title={title}
                titleAs="h1"
                titleClassName="page-title"
                titleId={sectionTitleId}
            />
            <p className="helper-note">Actions shown below are intentionally read-only in prototype mode.</p>
            <div aria-label={`${title} primary content`} className="page-primary-content">
                <dl className="info-grid">
                    {cards.map((card) => (
                        <CardChrome as="div" className="info-card" key={card.title}>
                            <dt>{card.title}</dt>
                            <dd>{card.value}</dd>
                        </CardChrome>
                    ))}
                </dl>
                <div className="placeholder-state-grid">
                    {renderChecklist('Available now', availableNow)}
                    {renderChecklist('Unavailable in prototype', unavailableInPrototype)}
                    {renderChecklist('Planned next wave', plannedNextWave)}
                </div>
                {actions.length > 0 ? (
                    <CardChrome as="section" aria-label="Prototype actions" className="placeholder-action-panel">
                        <h2>Simulated controls</h2>
                        <ul>
                            {actions.map((action, index) => {
                                const explanationId = `prototype-action-${index}`;

                                return (
                                    <ListRow key={action.label} withSeparator={false}>
                                        <button aria-describedby={explanationId} disabled type="button">
                                            {action.label}
                                        </button>
                                        <span id={explanationId}>{action.explanation}</span>
                                    </ListRow>
                                );
                            })}
                        </ul>
                    </CardChrome>
                ) : null}
                {table ? (
                    <CardChrome as="section" aria-label={table.title} className="data-table-shell">
                        <table className="data-table">
                            <caption>{table.title}</caption>
                            <thead>
                                <tr>
                                    {table.columns.map((column) => (
                                        <th key={column} scope="col">
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map((row) => (
                                    <tr key={row.join('|')}>
                                        {row.map((value) => (
                                            <td key={value}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardChrome>
                ) : null}
            </div>
        </section>
    );
}
