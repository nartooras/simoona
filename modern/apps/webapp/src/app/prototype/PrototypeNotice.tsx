import type { RouteAvailability } from '../routes/navigation';

interface PrototypeNoticeProps {
    mode: RouteAvailability;
    reason?: string;
}

const modeMeta: Record<RouteAvailability, { label: string; severity: string; description: string }> = {
    real: {
        label: 'Real',
        severity: 'Live data',
        description: 'This route is backed by the modern API read contract.',
    },
    mock: {
        label: 'Mock',
        severity: 'Prototype data',
        description: 'This route uses deterministic fixture data for demo walkthroughs.',
    },
    disabled: {
        label: 'Disabled',
        severity: 'Unavailable in prototype',
        description: 'This route is intentionally unavailable in the current prototype scope.',
    },
};

export function PrototypeNotice({ mode, reason }: PrototypeNoticeProps) {
    const meta = modeMeta[mode];
    const accessibilityRole = mode === 'disabled' ? 'alert' : 'status';

    return (
        <section
            aria-live={mode === 'disabled' ? 'assertive' : 'polite'}
            className={`prototype-notice prototype-notice--${mode}`}
            role={accessibilityRole}
        >
            <p className="prototype-notice-title">
                <strong>Prototype availability: {meta.label}.</strong>
                <span className={`prototype-notice-severity prototype-notice-severity--${mode}`}>{meta.severity}</span>
            </p>
            <p className="prototype-notice-copy">{reason ?? meta.description}</p>
        </section>
    );
}
