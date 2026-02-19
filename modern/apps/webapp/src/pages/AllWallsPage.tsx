import { NavLink } from 'react-router-dom';
import { getWallCollections, getWallFeedPath } from '../api/wallExperience';
import { CardChrome, SectionHeader, StatusBadge } from '../app/ui/primitives';

function statusToBadgeMode(status: 'available' | 'empty' | 'unavailable'): 'real' | 'mock' | 'disabled' {
    if (status === 'unavailable') {
        return 'disabled';
    }

    if (status === 'empty') {
        return 'mock';
    }

    return 'real';
}

export function AllWallsPage() {
    const wallCollections = getWallCollections();
    const subscribedWallIds = new Set(wallCollections.subscribedWalls.map((wall) => wall.id));

    return (
        <section aria-label="All walls page" className="wall-page wall-page--prototype" data-testid="all-walls-page">
            <SectionHeader
                className="wall-page-header"
                meta={
                    <span data-testid="all-walls-summary">
                        Official wall: {wallCollections.officialWall.label} · Subscribed walls: {wallCollections.subscribedWalls.length}
                    </span>
                }
                metaClassName="wall-data-source-summary"
                subtitle="Legacy-aligned read-only wall directory with explicit official, subscribed, and unavailable contexts."
                subtitleClassName="wall-page-subtitle"
                title="All walls"
                titleAs="h1"
                titleClassName="page-title"
            />
            <section className="wall-context-controls" data-testid="all-walls-controls">
                <header className="wall-context-controls-header">
                    <h2 className="wall-context-controls-title">Wall directory</h2>
                </header>
                <p className="wall-context-description" data-testid="all-walls-directory-description">
                    Official wall is always present. Subscribed walls open read-only feeds in their own context.
                </p>
                <div className="wall-context-chip-row" data-testid="all-walls-list">
                    {wallCollections.allWalls.map((wall) => {
                        const isOfficial = wall.id === wallCollections.officialWall.id;
                        const isSubscribed = subscribedWallIds.has(wall.id);
                        const isFeedRouteVisible = isOfficial || isSubscribed;

                        return (
                            <CardChrome as="article" className="wall-context-chip" data-testid={`all-walls-item-${wall.id}`} key={wall.id}>
                                <div className="wall-context-chip-state">
                                    {isFeedRouteVisible ? (
                                        <NavLink end to={getWallFeedPath(wall.id)}>
                                            {wall.label}
                                        </NavLink>
                                    ) : (
                                        <span>{wall.label}</span>
                                    )}
                                </div>
                                <StatusBadge label={wall.status} mode={statusToBadgeMode(wall.status)} />
                                <p className="wall-context-description">{wall.description}</p>
                                <p className="wall-filter-summary">
                                    {isOfficial ? 'Official wall' : isSubscribed ? 'Subscribed wall' : 'Not subscribed'}
                                </p>
                            </CardChrome>
                        );
                    })}
                </div>
            </section>
        </section>
    );
}
