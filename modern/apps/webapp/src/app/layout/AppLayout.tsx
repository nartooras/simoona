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
        <div className="app-shell">
            <header className="app-header">
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
                    <strong className="app-brand">Simoona</strong>
                    <div className="app-header-affordances">
                        <span className="header-chip">Prototype IA</span>
                        <span className="header-chip">Org: Demo</span>
                    </div>
                </div>
            </header>
            <div className="app-layout">
                <aside className={`app-sidebar${isMobileNavOpen ? ' open' : ''}`} id="app-sidebar-nav">
                    <nav aria-label="Main" className="app-nav">
                        {navigationGroups.map((group) => (
                            <section className="app-nav-group" key={group.title}>
                                <h2>{group.title}</h2>
                                <ul>
                                    {group.items.map((item) => (
                                        <li key={item.to}>
                                            <NavLink end={item.end} onClick={closeMobileNav} to={item.to}>
                                                {item.label}
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
                <main className="app-content">{children}</main>
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
