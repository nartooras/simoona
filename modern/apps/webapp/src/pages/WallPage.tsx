import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    fetchWallExperience,
    getWallCollections,
    getWallFeedPath,
    type WallCategoryFilter,
    wallCategoryOptions,
    type WallContextId,
    officialWallId,
    wallSortOptions,
    type WallSortMode,
} from '../api/wallExperience';
import type { SectionState } from '../api/wallExperienceTypes';
import { WallExperienceColumns } from '../app/wall/WallExperienceColumns';
import { SectionHeader, StatusBadge } from '../app/ui/primitives';

function formatSectionSourceLabel(section: SectionState<unknown>): string {
    if (section.adapter === 'real') {
        return 'real API';
    }

    if (section.adapter === 'mock') {
        return 'mock fixtures';
    }

    return 'disabled';
}

function statusToBadgeMode(status: 'available' | 'empty' | 'unavailable'): 'real' | 'mock' | 'disabled' {
    if (status === 'unavailable') {
        return 'disabled';
    }

    if (status === 'empty') {
        return 'mock';
    }

    return 'real';
}

export interface WallPageProps {
    wallId: WallContextId;
    routeLabel: string;
}

export function WallPage({ wallId, routeLabel }: WallPageProps) {
    const [sortMode, setSortMode] = useState<WallSortMode>('latest');
    const [category, setCategory] = useState<WallCategoryFilter>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState<Awaited<ReturnType<typeof fetchWallExperience>> | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadWallExperience() {
            setIsLoading(true);

            const response = await fetchWallExperience({
                wallId,
                sort: sortMode,
                category,
            });

            if (!isMounted) {
                return;
            }

            setResult(response);
            setIsLoading(false);
        }

        void loadWallExperience();

        return () => {
            isMounted = false;
        };
    }, [category, sortMode, wallId]);

    const fallbackCollections = useMemo(() => getWallCollections(), []);
    const selectedWall =
        result?.selectedWall ?? fallbackCollections.allWalls.find((wall) => wall.id === wallId) ?? fallbackCollections.officialWall;
    const feedNavigationWalls = result
        ? [result.officialWall, ...result.subscribedWalls]
        : [fallbackCollections.officialWall, ...fallbackCollections.subscribedWalls];

    return (
        <section aria-label="Wall feed page" className="wall-page wall-page--prototype" data-testid="wall-page">
            <SectionHeader
                className="wall-page-header"
                meta={
                    result ? (
                        <span data-testid="wall-data-source-summary">
                            Feed source: {formatSectionSourceLabel(result.feed)} · Widgets source:{' '}
                            {formatSectionSourceLabel(result.widgets)}
                        </span>
                    ) : undefined
                }
                metaClassName="wall-data-source-summary"
                subtitle={`Read-only ${selectedWall.label} feed context aligned to legacy wall navigation semantics.`}
                subtitleClassName="wall-page-subtitle"
                title={routeLabel}
                titleAs="h1"
                titleClassName="page-title"
            />
            <section className="wall-context-controls" data-testid="wall-context-controls">
                <header className="wall-context-controls-header">
                    <h2 className="wall-context-controls-title">Wall context</h2>
                    <StatusBadge
                        className="wall-context-status"
                        label={selectedWall.status}
                        mode={statusToBadgeMode(selectedWall.status)}
                    />
                </header>
                <p className="wall-context-description" data-testid="wall-context-summary">
                    {selectedWall.description}
                </p>
                <div className="wall-context-control-grid">
                    <label className="wall-control-group" htmlFor="wall-sort-select">
                        <span>Sort</span>
                        <select
                            data-testid="wall-sort-select"
                            id="wall-sort-select"
                            onChange={(event) => {
                                setSortMode(event.target.value as WallSortMode);
                            }}
                            value={sortMode}
                        >
                            {wallSortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="wall-control-group" htmlFor="wall-category-select">
                        <span>Topic</span>
                        <select
                            data-testid="wall-category-select"
                            id="wall-category-select"
                            onChange={(event) => {
                                setCategory(event.target.value as WallCategoryFilter);
                            }}
                            value={category}
                        >
                            {wallCategoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="wall-context-chip-row" data-testid="wall-context-link-row">
                    <NavLink className="wall-context-chip" data-selected="false" data-testid="wall-context-link-all" end to="/walls">
                        <span>All walls</span>
                        <span className="wall-context-chip-state">directory</span>
                    </NavLink>
                    {feedNavigationWalls.map((wall) => {
                        const isOfficial = wall.id === officialWallId;

                        return (
                            <NavLink
                                className="wall-context-chip"
                                data-selected={wall.id === wallId ? 'true' : 'false'}
                                data-testid={`wall-context-link-${wall.id}`}
                                end
                                key={wall.id}
                                to={getWallFeedPath(wall.id)}
                            >
                                <span>{isOfficial ? 'Official wall' : wall.label}</span>
                                <span className="wall-context-chip-state">{wall.status}</span>
                            </NavLink>
                        );
                    })}
                </div>
                <p className="wall-filter-summary" data-testid="wall-filter-summary">
                    Active controls: {sortMode} sort, {category} topic.
                </p>
            </section>
            <WallExperienceColumns
                copy={{
                    feedLoadingMessage: `Loading ${selectedWall.label} feed...`,
                    feedEmptyTitle: 'No posts in selected wall',
                    feedEmptyMessage: `No posts are available in ${selectedWall.label} for the current filter selection.`,
                    widgetsLoadingMessage: `Loading ${selectedWall.label} widgets...`,
                }}
                result={isLoading ? null : result}
            />
        </section>
    );
}
