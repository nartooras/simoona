import { SectionHeader } from '../app/ui/primitives';

export function HealthPage() {
    return (
        <section className="page-section">
            <SectionHeader title="Health" titleAs="h1" titleClassName="page-title" />
            <p className="status-message">Status: OK. Modern API baseline is healthy for demo start.</p>
        </section>
    );
}
