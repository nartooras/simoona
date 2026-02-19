import { useEffect, useMemo, useState } from 'react';
import {
    fetchWallExperience,
    type WallCategoryFilter,
    wallCategoryOptions,
    type WallContextId,
    wallContextOrder,
    wallSortOptions,
    type WallSortMode,
} from '../api/wallExperience';
import type { SectionState } from '../api/wallExperienceTypes';
import { WallExperienceColumns } from '../app/wall/WallExperienceColumns';
import { SectionHeader, StatusBadge } from '../app/ui/primitives';

const defaultWallLabels: Record<WallContextId, string> = {
    'company-wall': 'Company Wall',
    'engineering-wall': 'Engineering Wall',
    'culture-wall': 'People Wall',
    'newcomers-wall': 'Newcomers Wall',
    'incident-wall': 'Incident Wall',
};

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

export function WallPage() {
    const [selectedWallId, setSelectedWallId] = useState<WallContextId>('company-wall');
    const [sortMode, setSortMode] = useState<WallSortMode>('latest');
    const [category, setCategory] = useState<WallCategoryFilter>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState<Awaited<ReturnType<typeof fetchWallExperience>> | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadWallExperience() {
            setIsLoading(true);

            const response = await fetchWallExperience({
                wallId: selectedWallId,
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
    }, [category, selectedWallId, sortMode]);

    const wallOptions = useMemo(() => {
        if (result) {
            return result.availableWalls;
        }

        return wallContextOrder.map((wallId) => ({
            id: wallId,
            label: defaultWallLabels[wallId],
            description: 'Loading wall context details...',
            status: 'available' as const,
        }));
    }, [result]);

    const selectedWall = wallOptions.find((wall) => wall.id === selectedWallId) ?? wallOptions[0];

    return (
        <section aria-label="Legacy-like Wall page" className="wall-page wall-page--prototype" data-testid="wall-page">
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
                subtitle="Dedicated wall flow with deterministic context switching, filtering, and demo-safe interactions."
                subtitleClassName="wall-page-subtitle"
                title="Wall"
                titleAs="h1"
                titleClassName="page-title"
            />
            <section className="wall-context-controls" data-testid="wall-context-controls">
                <header className="wall-context-controls-header">
                    <h2 className="wall-context-controls-title">Wall context</h2>
                    {selectedWall ? (
                        <StatusBadge
                            className="wall-context-status"
                            label={selectedWall.status}
                            mode={statusToBadgeMode(selectedWall.status)}
                        />
                    ) : null}
                </header>
                <p className="wall-context-description" data-testid="wall-context-summary">
                    {selectedWall?.description ?? 'Loading wall context details...'}
                </p>
                <div className="wall-context-control-grid">
                    <label className="wall-control-group" htmlFor="wall-context-select">
                        <span>Wall</span>
                        <select
                            data-testid="wall-context-select"
                            id="wall-context-select"
                            onChange={(event) => {
                                setSelectedWallId(event.target.value as WallContextId);
                            }}
                            value={selectedWallId}
                        >
                            {wallOptions.map((wall) => (
                                <option key={wall.id} value={wall.id}>
                                    {wall.label}
                                </option>
                            ))}
                        </select>
                    </label>
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
                <div className="wall-context-chip-row" data-testid="wall-context-chip-row">
                    {wallOptions.slice(0, 4).map((wall) => (
                        <button
                            className="wall-context-chip"
                            data-selected={wall.id === selectedWallId ? 'true' : 'false'}
                            data-testid={`wall-context-chip-${wall.id}`}
                            key={wall.id}
                            onClick={() => {
                                setSelectedWallId(wall.id);
                            }}
                            type="button"
                        >
                            <span>{wall.label}</span>
                            <span className="wall-context-chip-state">{wall.status}</span>
                        </button>
                    ))}
                </div>
                <p className="wall-filter-summary" data-testid="wall-filter-summary">
                    Active controls: {sortMode} sort, {category} topic.
                </p>
            </section>
            <WallExperienceColumns
                copy={{
                    feedLoadingMessage: `Loading ${selectedWall?.label ?? 'selected'} feed...`,
                    feedEmptyTitle: 'No posts in selected wall',
                    feedEmptyMessage: `No posts are available in ${selectedWall?.label ?? 'this wall'} for the current filter selection.`,
                    widgetsLoadingMessage: `Loading ${selectedWall?.label ?? 'selected'} widgets...`,
                }}
                result={isLoading ? null : result}
            />
        </section>
    );
}
