import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navigationGroups } from '../routes/navigation';

export function AppLayout({ children }: PropsWithChildren) {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    function closeMobileNav() {
        setIsMobileNavOpen(false);
    }

    return (
        <div className="app-shell" data-shell-geometry="wave1a">
            <header className="app-header" data-testid="app-header">
                <div className="app-header-content">
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
                    <label className="app-header-search" htmlFor="global-header-search">
                        <span className="visually-hidden">Search</span>
                        <input
                            aria-label="Global search"
                            id="global-header-search"
                            placeholder="Search people, walls, posts..."
                            type="search"
                        />
                    </label>
                    <div className="app-header-affordances">
                        <button aria-label="Add shortcut" className="header-action header-action--icon" type="button">
                            +
                        </button>
                        <button aria-label="Inbox" className="header-action header-action--icon" type="button">
                            3
                        </button>
                        <button className="header-action" type="button">
                            Quick Links
                        </button>
                        <button className="header-action" type="button">
                            Alerts
                        </button>
                        <button className="header-user" type="button">
                            <span aria-hidden="true" className="header-user-avatar">
                                DU
                            </span>
                            <span className="header-user-name">Demo User</span>
                        </button>
                    </div>
                </div>
            </header>
            <div className="app-layout" data-testid="app-layout">
                <aside className={`app-sidebar${isMobileNavOpen ? ' open' : ''}`} data-testid="app-sidebar" id="app-sidebar-nav">
                    <nav aria-label="Primary navigation" className="app-nav">
                        {navigationGroups.map((group) => (
                            <section className="app-nav-group" key={group.title}>
                                <h2 className="app-nav-group-title" id={`nav-group-${group.key}`}>
                                    <span aria-hidden="true" className="app-nav-group-indicator">
                                        ▾
                                    </span>
                                    {group.title}
                                </h2>
                                <ul aria-labelledby={`nav-group-${group.key}`}>
                                    {group.items.map((item) => (
                                        <li key={item.to}>
                                            <NavLink end={item.end} onClick={closeMobileNav} to={item.to}>
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
                        ))}
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
