import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navigationGroups } from '../routes/navigation';

export function AppLayout({ children }: PropsWithChildren) {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(navigationGroups.map((group) => [group.key, false])),
    );

    function closeMobileNav() {
        setIsMobileNavOpen(false);
    }

    function toggleGroup(groupKey: string) {
        setCollapsedGroups((current) => ({
            ...current,
            [groupKey]: !current[groupKey],
        }));
    }

    return (
        <div
            className="app-shell shell-wave6"
            data-shell-fidelity="wave6-shell-home-bundle"
            data-shell-geometry="wave6"
            data-shell-taxonomy="wave6-left-rail-taxonomy"
        >
            <header className="app-header topbar-height-legacy-44" data-testid="app-header">
                <div className="app-header-content topbar-geometry-wave6" data-topbar-geometry="legacy-v6">
                    <button
                        aria-controls="app-sidebar-nav"
                        aria-expanded={isMobileNavOpen}
                        aria-label="Toggle navigation"
                        className="app-nav-toggle"
                        type="button"
                        onClick={() => setIsMobileNavOpen((isOpen) => !isOpen)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                    <div className="app-brand-cluster">
                        <span aria-hidden="true" className="app-brand-mark">
                            S
                        </span>
                        <div className="app-brand-copy">
                            <strong className="app-brand">Simoona</strong>
                            <span className="app-brand-context">Core wall</span>
                        </div>
                    </div>
                    <label
                        className="app-header-search topbar-search"
                        data-search-focus={isSearchFocused ? 'true' : 'false'}
                        htmlFor="global-header-search"
                    >
                        <span className="visually-hidden">Search</span>
                        <span aria-hidden="true" className="topbar-search-icon" />
                        <input
                            aria-label="Global search"
                            className="topbar-search-input"
                            id="global-header-search"
                            placeholder="Search"
                            type="search"
                            onBlur={() => setIsSearchFocused(false)}
                            onFocus={() => setIsSearchFocused(true)}
                        />
                    </label>
                    <div className="app-header-affordances topbar-actions" data-testid="topbar-controls" data-topbar-controls="legacy-hierarchy-v3a">
                        <button
                            aria-label="Quick Links"
                            className="header-action header-action--icon topbar-action topbar-action--icon topbar-action--icon-only"
                            data-header-control="quick-links"
                            type="button"
                        >
                            <span aria-hidden="true" className="topbar-icon topbar-icon--links" />
                        </button>
                        <button
                            aria-label="Messages"
                            className="header-action header-action--icon topbar-action topbar-action--icon topbar-action--icon-only"
                            data-header-control="messages"
                            type="button"
                        >
                            <span aria-hidden="true" className="topbar-icon topbar-icon--messages" />
                        </button>
                        <button
                            aria-label="Notifications"
                            className="header-action header-action--icon topbar-action topbar-action--icon topbar-action--icon-only"
                            data-header-control="notifications"
                            type="button"
                        >
                            <span aria-hidden="true" className="topbar-icon topbar-icon--notifications" />
                            <span aria-label="3 unread notifications" className="topbar-count-badge">
                                3
                            </span>
                        </button>
                        <button className="header-user topbar-action topbar-action--user" data-header-control="user-panel" type="button">
                            <span aria-hidden="true" className="header-user-avatar">
                                DU
                            </span>
                            <span className="header-user-name">Demo User</span>
                            <span aria-hidden="true" className="header-user-chevron">
                                ▾
                            </span>
                        </button>
                    </div>
                </div>
            </header>
            <div className="app-layout" data-testid="app-layout">
                <aside
                    className={`app-sidebar left-rail-width-legacy-236${isMobileNavOpen ? ' open' : ''}`}
                    data-left-rail-width="legacy-236"
                    data-testid="app-sidebar"
                    id="app-sidebar-nav"
                >
                    <nav
                        aria-label="Primary navigation"
                        className="app-nav left-rail-density-wave6"
                        data-left-rail-density="legacy-compact-wave6"
                    >
                        {navigationGroups.map((group) => {
                            const isCollapsed = collapsedGroups[group.key];

                            return (
                                <section
                                    className="app-nav-group"
                                    data-group={group.key}
                                    data-group-state={isCollapsed ? 'collapsed' : 'expanded'}
                                    key={group.title}
                                >
                                    <h2 className="app-nav-group-title" id={`nav-group-${group.key}`}>
                                        <button
                                            aria-controls={`nav-group-list-${group.key}`}
                                            aria-expanded={!isCollapsed}
                                            className="app-nav-group-toggle"
                                            data-testid={`nav-group-toggle-${group.key}`}
                                            type="button"
                                            onClick={() => toggleGroup(group.key)}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`app-nav-group-chevron${isCollapsed ? ' collapsed' : ''}`}
                                            >
                                                ▾
                                            </span>
                                            <span aria-hidden="true" className={`app-nav-group-icon app-nav-group-icon--${group.key}`} />
                                            <span className="app-nav-group-label">{group.title}</span>
                                        </button>
                                    </h2>
                                    <ul
                                        aria-hidden={isCollapsed}
                                        aria-labelledby={`nav-group-${group.key}`}
                                        className="app-nav-group-list"
                                        data-collapsed={isCollapsed ? 'true' : 'false'}
                                        id={`nav-group-list-${group.key}`}
                                    >
                                        {group.items.map((item) => (
                                            <li key={item.to}>
                                                <NavLink end={item.end} onClick={closeMobileNav} tabIndex={isCollapsed ? -1 : undefined} to={item.to}>
                                                    <span aria-hidden="true" className="app-nav-item-bullet" />
                                                    <span className="nav-item-label">{item.label}</span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={`nav-availability nav-availability--${item.availability}`}
                                                    >
                                                        {item.availability}
                                                    </span>
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            );
                        })}
                    </nav>
                </aside>
                <main className="app-content" data-testid="app-content">
                    {children}
                </main>
                <button
                    aria-hidden={!isMobileNavOpen}
                    className={`app-overlay${isMobileNavOpen ? ' visible' : ''}`}
                    tabIndex={isMobileNavOpen ? 0 : -1}
                    type="button"
                    onClick={closeMobileNav}
                />
            </div>
        </div>
    );
}
