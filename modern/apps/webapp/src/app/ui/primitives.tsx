import { createElement, type HTMLAttributes, type ReactNode } from 'react';

export type AvailabilityMode = 'real' | 'mock' | 'disabled';

function joinClasses(...classNames: Array<string | undefined>): string {
    return classNames.filter(Boolean).join(' ');
}

export interface SectionHeaderProps {
    title: string;
    titleId?: string;
    titleAs?: 'h1' | 'h2' | 'h3';
    subtitle?: ReactNode;
    subtitleClassName?: string;
    meta?: ReactNode;
    metaClassName?: string;
    className?: string;
    titleClassName?: string;
}

export function SectionHeader({
    title,
    titleId,
    titleAs = 'h1',
    subtitle,
    subtitleClassName,
    meta,
    metaClassName,
    className,
    titleClassName,
}: SectionHeaderProps) {
    return (
        <header className={joinClasses('ui-section-header', className)}>
            {createElement(titleAs, { className: joinClasses('ui-section-title', titleClassName), id: titleId }, title)}
            {subtitle ? <p className={joinClasses('ui-section-subtitle', subtitleClassName)}>{subtitle}</p> : null}
            {meta ? <p className={joinClasses('ui-section-meta', metaClassName)}>{meta}</p> : null}
        </header>
    );
}

const defaultStatusLabel: Record<AvailabilityMode, string> = {
    real: 'Real',
    mock: 'Mock',
    disabled: 'Disabled',
};

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    mode: AvailabilityMode;
    label?: string;
}

export function StatusBadge({ mode, label, className, ...rest }: StatusBadgeProps) {
    return (
        <span
            className={joinClasses('ui-status-badge', `ui-status-badge--${mode}`, className)}
            data-status-mode={mode}
            {...rest}
        >
            {label ?? defaultStatusLabel[mode]}
        </span>
    );
}

export interface InfoMetaRowProps extends HTMLAttributes<HTMLDivElement> {
    primary: ReactNode;
    secondary?: ReactNode;
    primaryClassName?: string;
    secondaryClassName?: string;
    primaryTestId?: string;
    secondaryTestId?: string;
}

export function InfoMetaRow({
    primary,
    secondary,
    className,
    primaryClassName,
    secondaryClassName,
    primaryTestId,
    secondaryTestId,
    ...rest
}: InfoMetaRowProps) {
    return (
        <div className={joinClasses('ui-info-meta-row', className)} {...rest}>
            <p className={joinClasses('ui-info-meta-primary', primaryClassName)} data-testid={primaryTestId}>
                {primary}
            </p>
            {secondary ? (
                <p className={joinClasses('ui-info-meta-secondary', secondaryClassName)} data-testid={secondaryTestId}>
                    {secondary}
                </p>
            ) : null}
        </div>
    );
}

export interface ListRowProps extends HTMLAttributes<HTMLLIElement> {
    withSeparator?: boolean;
}

export function ListRow({ withSeparator = true, className, children, ...rest }: ListRowProps) {
    return (
        <li className={joinClasses('ui-list-row', withSeparator ? 'ui-list-row--separator' : undefined, className)} {...rest}>
            {children}
        </li>
    );
}

export interface CardChromeProps extends HTMLAttributes<HTMLElement> {
    as?: 'section' | 'article' | 'aside' | 'div';
    tone?: 'default' | 'muted' | 'warning';
}

export function CardChrome({ as = 'section', tone = 'default', className, children, ...rest }: CardChromeProps) {
    return createElement(
        as,
        {
            ...rest,
            className: joinClasses('ui-card-chrome', `ui-card-chrome--${tone}`, className),
        },
        children,
    );
}
