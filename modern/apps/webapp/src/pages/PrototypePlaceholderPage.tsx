interface PrototypePlaceholderPageProps {
    title: string;
    summary: string;
    cards: ReadonlyArray<{
        title: string;
        value: string;
    }>;
}

export function PrototypePlaceholderPage({ title, summary, cards }: PrototypePlaceholderPageProps) {
    return (
        <section className="page-section">
            <h1 className="page-title">{title}</h1>
            <p className="status-message">{summary}</p>
            <dl className="info-grid">
                {cards.map((card) => (
                    <div className="info-card" key={card.title}>
                        <dt>{card.title}</dt>
                        <dd>{card.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
