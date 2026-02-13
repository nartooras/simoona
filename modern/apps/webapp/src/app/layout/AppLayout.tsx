import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="app-container">
                    <strong>Simoona Modern Webapp</strong>
                </div>
            </header>
            <main className="app-container app-content">{children}</main>
        </div>
    );
}
