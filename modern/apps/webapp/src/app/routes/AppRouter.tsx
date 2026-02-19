import type { ReactNode } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { HealthPage } from '../../pages/HealthPage';
import { HomePage } from '../../pages/HomePage';
import { GeneralSettingsPage } from '../../pages/GeneralSettingsPage';
import { UserInfoPage } from '../../pages/UserInfoPage';
import { EmployeeDirectoryPage } from '../../pages/EmployeeDirectoryPage';
import { MyProfilePage } from '../../pages/MyProfilePage';
import { PrototypeNotice } from '../prototype/PrototypeNotice';
import { getRouteDefinition, navigationRouteDefinitions, type NavigationRoutePath, routeAvailabilityMap } from './navigation';
import { PrototypePlaceholderPage } from '../../pages/PrototypePlaceholderPage';
import { getPrototypePlaceholder } from '../../api/prototypePlaceholders';
import { CardChrome, StatusBadge } from '../ui/primitives';

function getRouteAvailability(path: NavigationRoutePath) {
    return routeAvailabilityMap[path] ?? { mode: 'real' as const };
}

const routePageByPath: Record<NavigationRoutePath, ReactNode> = {
    '/': <HomePage />,
    '/activities/feed': <PrototypePlaceholderPage {...getPrototypePlaceholder('/activities/feed')} />,
    '/recognition': <PrototypePlaceholderPage {...getPrototypePlaceholder('/recognition')} />,
    '/events': <PrototypePlaceholderPage {...getPrototypePlaceholder('/events')} />,
    '/kudos': <PrototypePlaceholderPage {...getPrototypePlaceholder('/kudos')} />,
    '/service-requests': <PrototypePlaceholderPage {...getPrototypePlaceholder('/service-requests')} />,
    '/books': <PrototypePlaceholderPage {...getPrototypePlaceholder('/books')} />,
    '/vacations': <PrototypePlaceholderPage {...getPrototypePlaceholder('/vacations')} />,
    '/office-map': <PrototypePlaceholderPage {...getPrototypePlaceholder('/office-map')} />,
    '/organization/structure': <PrototypePlaceholderPage {...getPrototypePlaceholder('/organization/structure')} />,
    '/employees': <EmployeeDirectoryPage />,
    '/projects': <PrototypePlaceholderPage {...getPrototypePlaceholder('/projects')} />,
    '/committees': <PrototypePlaceholderPage {...getPrototypePlaceholder('/committees')} />,
    '/teams': <PrototypePlaceholderPage {...getPrototypePlaceholder('/teams')} />,
    '/user-info': <UserInfoPage />,
    '/settings/general': <GeneralSettingsPage />,
    '/profiles/me': <MyProfilePage />,
    '/externals/integrations': <PrototypePlaceholderPage {...getPrototypePlaceholder('/externals/integrations')} />,
    '/health': <HealthPage />,
};

function assertRoutePageCoverage() {
    const declaredPaths = new Set(navigationRouteDefinitions.map((entry) => entry.path as NavigationRoutePath));
    const mappedPaths = new Set(Object.keys(routePageByPath) as NavigationRoutePath[]);

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

function renderRoute(path: NavigationRoutePath, page: ReactNode) {
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

const primaryRoutes: RouteObject[] = navigationRouteDefinitions.map((routeDefinition) => {
    const path = routeDefinition.path as NavigationRoutePath;

    return {
        path,
        element: renderRoute(path, routePageByPath[path]),
    };
});

export const appRoutes: RouteObject[] = [...primaryRoutes, { path: '*', element: <Navigate replace to="/" /> }];
