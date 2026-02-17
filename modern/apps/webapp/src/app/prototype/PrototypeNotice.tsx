import type { RouteAvailability } from '../routes/navigation';

interface PrototypeNoticeProps {
    mode: RouteAvailability;
    reason?: string;
}

const modeLabels: Record<RouteAvailability, string> = {
    real: 'Real',
    mock: 'Mock',
    disabled: 'Disabled',
};

export function PrototypeNotice({ mode, reason }: PrototypeNoticeProps) {
    return (
        <p className={`prototype-notice prototype-notice--${mode}`} role="status">
            <strong>Prototype availability: {modeLabels[mode]}.</strong>{' '}
            {mode === 'real'
                ? 'This route is backed by the modern API contract.'
                : reason ?? 'This route is not production-ready in the prototype.'}
        </p>
    );
}
