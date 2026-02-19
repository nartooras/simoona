import type { ReactNode } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { HealthPage } from '../../pages/HealthPage';
import { WallPage } from '../../pages/WallPage';
import { GeneralSettingsPage } from '../../pages/GeneralSettingsPage';
import { UserInfoPage } from '../../pages/UserInfoPage';
import { EmployeeDirectoryPage } from '../../pages/EmployeeDirectoryPage';
import { MyProfilePage } from '../../pages/MyProfilePage';
import { EventsPage } from '../../pages/EventsPage';
import { KudosPage } from '../../pages/KudosPage';
import { PrototypeNotice } from '../prototype/PrototypeNotice';
import { getRouteDefinition, navigationRouteDefinitions, routeAvailabilityMap } from './navigation';
import { PrototypePlaceholderPage } from '../../pages/PrototypePlaceholderPage';
import { getPrototypePlaceholder } from '../../api/prototypePlaceholders';
import { CardChrome, StatusBadge } from '../ui/primitives';
import { getWallCollections, getWallFeedPath, officialWallId } from '../../api/wallExperience';
import { AllWallsPage } from '../../pages/AllWallsPage';

function getRouteAvailability(path: string) {
    return routeAvailabilityMap[path] ?? { mode: 'real' as const };
}

const wallCollections = getWallCollections();
const wallFeedRoutes = [
    {
        path: getWallFeedPath(officialWallId),
        wallId: officialWallId,
        routeLabel: 'Official wall',
    },
    ...wallCollections.subscribedWalls.map((wall) => ({
        path: getWallFeedPath(wall.id),
        wallId: wall.id,
        routeLabel: wall.label,
    })),
];

const routePageByPath = Object.fromEntries([
    ...wallFeedRoutes.map((route) => [
        route.path,
        <WallPage key={route.path} routeLabel={route.routeLabel} wallId={route.wallId} />,
    ]),
    ['/walls', <AllWallsPage key="/walls" />],
    ['/activities/feed', <PrototypePlaceholderPage {...getPrototypePlaceholder('/activities/feed')} />],
    ['/recognition', <PrototypePlaceholderPage {...getPrototypePlaceholder('/recognition')} />],
    ['/events', <EventsPage />],
    ['/kudos', <KudosPage />],
    ['/service-requests', <PrototypePlaceholderPage {...getPrototypePlaceholder('/service-requests')} />],
    ['/books', <PrototypePlaceholderPage {...getPrototypePlaceholder('/books')} />],
    ['/vacations', <PrototypePlaceholderPage {...getPrototypePlaceholder('/vacations')} />],
    ['/office-map', <PrototypePlaceholderPage {...getPrototypePlaceholder('/office-map')} />],
    ['/organization/structure', <PrototypePlaceholderPage {...getPrototypePlaceholder('/organization/structure')} />],
    ['/employees', <EmployeeDirectoryPage />],
    ['/projects', <PrototypePlaceholderPage {...getPrototypePlaceholder('/projects')} />],
    ['/committees', <PrototypePlaceholderPage {...getPrototypePlaceholder('/committees')} />],
    ['/teams', <PrototypePlaceholderPage {...getPrototypePlaceholder('/teams')} />],
    ['/user-info', <UserInfoPage />],
    ['/settings/general', <GeneralSettingsPage />],
    ['/profiles/me', <MyProfilePage />],
    ['/externals/integrations', <PrototypePlaceholderPage {...getPrototypePlaceholder('/externals/integrations')} />],
    ['/health', <HealthPage />],
]) as Record<string, ReactNode>;

function assertRoutePageCoverage() {
    const declaredPaths = new Set(navigationRouteDefinitions.map((entry) => entry.path));
    const mappedPaths = new Set(Object.keys(routePageByPath));

    for (const declaredPath of declaredPaths) {
        if (!mappedPaths.has(declaredPath)) {
            throw new Error(`Route '${declaredPath}' is missing from AppRouter routePageByPath.`);
        }
    }

    for (const mappedPath of mappedPaths) {
        if (!declaredPaths.has(mappedPath)) {
            throw new Error(`Route '${mappedPath}' is mapped in AppRouter but not declared in navigation metadata.`);
        }
    }
}

assertRoutePageCoverage();

function renderRoute(path: string, page: ReactNode) {
    const availability = getRouteAvailability(path);
    const routeDefinition = getRouteDefinition(path);

    return (
        <AppLayout>
            <PrototypeNotice mode={availability.mode} reason={availability.reason} />
            <CardChrome
                as="section"
                aria-label={`${routeDefinition.label} route contract`}
                className="route-contract-marker"
                data-route-availability={availability.mode}
                data-route-mode={routeDefinition.destinationMode}
                data-route-path={path}
                data-testid="route-contract-marker"
            >
                <p className="route-contract-heading">
                    {routeDefinition.label}
                    <StatusBadge className="route-contract-badge" label={availability.mode} mode={availability.mode} />
                </p>
                <p className="route-contract-note">{routeDefinition.demoNote}</p>
            </CardChrome>
            <section
                aria-label={`${routeDefinition.label} content`}
                className="page-content-region"
                data-page-theme="legacy-unified-wave7"
                data-route-status={availability.mode}
                data-testid="destination-content-region"
            >
                {page}
            </section>
        </AppLayout>
    );
}

const primaryRoutes: RouteObject[] = navigationRouteDefinitions.map((routeDefinition) => ({
    path: routeDefinition.path,
    element: renderRoute(routeDefinition.path, routePageByPath[routeDefinition.path]),
}));

export const appRoutes: RouteObject[] = [...primaryRoutes, { path: '*', element: <Navigate replace to={getWallFeedPath(officialWallId)} /> }];
