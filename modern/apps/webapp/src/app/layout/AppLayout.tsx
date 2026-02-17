import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

export function AppLayout({ children }: PropsWithChildren) {
    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="app-container">
                    <strong>Simoona Modern Webapp</strong>
                    <nav className="app-nav" aria-label="Main">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/health">Health</NavLink>
                        <NavLink to="/user-info">User Info</NavLink>
                        <NavLink to="/settings/general">General Settings</NavLink>
                        <NavLink to="/employees">Employees</NavLink>
                        <NavLink to="/profiles/me">My Profile</NavLink>
                    </nav>
                </div>
            </header>
            <main className="app-container app-content">{children}</main>
        </div>
    );
}
