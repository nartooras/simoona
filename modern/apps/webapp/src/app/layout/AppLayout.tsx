import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export function AppLayout({ children }: PropsWithChildren) {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const navGroups = [
        {
            title: 'Workspace',
            links: [
                { to: '/', label: 'Home', end: true },
                { to: '/employees', label: 'Employees' },
            ],
        },
        {
            title: 'Account',
            links: [
                { to: '/profiles/me', label: 'My Profile' },
                { to: '/settings/general', label: 'General Settings' },
                { to: '/user-info', label: 'User Info' },
            ],
        },
        {
            title: 'System',
            links: [{ to: '/health', label: 'Health' }],
        },
    ];

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
                </div>
            </header>
            <div className="app-layout">
                <aside className={`app-sidebar${isMobileNavOpen ? ' open' : ''}`} id="app-sidebar-nav">
                    <nav aria-label="Main" className="app-nav">
                        {navGroups.map((group) => (
                            <section className="app-nav-group" key={group.title}>
                                <h2>{group.title}</h2>
                                <ul>
                                    {group.links.map((link) => (
                                        <li key={link.to}>
                                            <NavLink end={link.end} onClick={closeMobileNav} to={link.to}>
                                                {link.label}
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
