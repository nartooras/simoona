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
    return (
        <section className="page-section">
            <h1 className="page-title">{title}</h1>
            <p className="status-message">
                {summary} <strong>Data source: {dataSource}.</strong>
            </p>
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
                        {actions.map((action) => (
                            <li key={action.label}>
                                <button disabled type="button">
                                    {action.label}
                                </button>
                                <span>{action.explanation}</span>
                            </li>
                        ))}
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
        </section>
    );
}
