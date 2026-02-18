import { useId } from 'react';

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
        <section className="placeholder-state-block">
            <h2>{title}</h2>
            <ul>
                {entries.map((entry) => (
                    <li key={entry}>{entry}</li>
                ))}
            </ul>
        </section>
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
            <header className="page-header-block">
                <h1 className="page-title" id={sectionTitleId}>
                    {title}
                </h1>
                <p className="status-message">
                    {summary} <strong>Data source: {dataSourceLabels[dataSource]}.</strong>
                </p>
                <p className="helper-note">Actions shown below are intentionally read-only in prototype mode.</p>
            </header>
            <div aria-label={`${title} primary content`} className="page-primary-content">
                <dl className="info-grid">
                    {cards.map((card) => (
                        <div className="info-card" key={card.title}>
                            <dt>{card.title}</dt>
                            <dd>{card.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="placeholder-state-grid">
                    {renderChecklist('Available now', availableNow)}
                    {renderChecklist('Unavailable in prototype', unavailableInPrototype)}
                    {renderChecklist('Planned next wave', plannedNextWave)}
                </div>
                {actions.length > 0 ? (
                    <section className="placeholder-action-panel" aria-label="Prototype actions">
                        <h2>Simulated controls</h2>
                        <ul>
                            {actions.map((action, index) => {
                                const explanationId = `prototype-action-${index}`;

                                return (
                                    <li key={action.label}>
                                        <button aria-describedby={explanationId} disabled type="button">
                                            {action.label}
                                        </button>
                                        <span id={explanationId}>{action.explanation}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ) : null}
                {table ? (
                    <section className="data-table-shell" aria-label={table.title}>
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
                    </section>
                ) : null}
            </div>
        </section>
    );
}
