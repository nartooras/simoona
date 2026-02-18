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
import { navigationRouteDefinitions, type NavigationRoutePath, routeAvailabilityMap } from './navigation';
import { PrototypePlaceholderPage } from '../../pages/PrototypePlaceholderPage';
import { getPrototypePlaceholder } from '../../api/prototypePlaceholders';

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

function renderRoute(path: NavigationRoutePath, page: ReactNode, label: string) {
    const availability = getRouteAvailability(path);

    return (
        <AppLayout>
            <PrototypeNotice mode={availability.mode} reason={availability.reason} />
            <section aria-label={`${label} content`} className="page-content-region" data-testid="destination-content-region">
                {page}
            </section>
        </AppLayout>
    );
}

const primaryRoutes: RouteObject[] = navigationRouteDefinitions.map((routeDefinition) => ({
    path: routeDefinition.path,
    element: renderRoute(routeDefinition.path, routePageByPath[routeDefinition.path], routeDefinition.label),
}));

export const appRoutes: RouteObject[] = [...primaryRoutes, { path: '*', element: <Navigate replace to="/" /> }];
