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
import { routeAvailabilityMap } from './navigation';
import { PrototypePlaceholderPage } from '../../pages/PrototypePlaceholderPage';
import { getPrototypePlaceholder } from '../../api/prototypePlaceholders';

function getRouteAvailability(path: string) {
    return routeAvailabilityMap[path] ?? { mode: 'real' as const };
}

function renderRoute(path: string, page: ReactNode) {
    const availability = getRouteAvailability(path);

    return (
        <AppLayout>
            <PrototypeNotice mode={availability.mode} reason={availability.reason} />
            {page}
        </AppLayout>
    );
}

export const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: renderRoute('/', <HomePage />),
    },
    {
        path: '/health',
        element: renderRoute('/health', <HealthPage />),
    },
    {
        path: '/user-info',
        element: renderRoute('/user-info', <UserInfoPage />),
    },
    {
        path: '/settings/general',
        element: renderRoute('/settings/general', <GeneralSettingsPage />),
    },
    {
        path: '/employees',
        element: renderRoute('/employees', <EmployeeDirectoryPage />),
    },
    {
        path: '/profiles/me',
        element: renderRoute('/profiles/me', <MyProfilePage />),
    },
    {
        path: '/activities/feed',
        element: renderRoute('/activities/feed', <PrototypePlaceholderPage {...getPrototypePlaceholder('/activities/feed')} />),
    },
    {
        path: '/recognition',
        element: renderRoute('/recognition', <PrototypePlaceholderPage {...getPrototypePlaceholder('/recognition')} />),
    },
    {
        path: '/teams',
        element: renderRoute('/teams', <PrototypePlaceholderPage {...getPrototypePlaceholder('/teams')} />),
    },
    {
        path: '/events',
        element: renderRoute('/events', <PrototypePlaceholderPage {...getPrototypePlaceholder('/events')} />),
    },
    {
        path: '/vacations',
        element: renderRoute('/vacations', <PrototypePlaceholderPage {...getPrototypePlaceholder('/vacations')} />),
    },
    {
        path: '/kudos',
        element: renderRoute('/kudos', <PrototypePlaceholderPage {...getPrototypePlaceholder('/kudos')} />),
    },
    {
        path: '/books',
        element: renderRoute('/books', <PrototypePlaceholderPage {...getPrototypePlaceholder('/books')} />),
    },
    {
        path: '/service-requests',
        element: renderRoute(
            '/service-requests',
            <PrototypePlaceholderPage {...getPrototypePlaceholder('/service-requests')} />,
        ),
    },
    {
        path: '/projects',
        element: renderRoute('/projects', <PrototypePlaceholderPage {...getPrototypePlaceholder('/projects')} />),
    },
    {
        path: '/office-map',
        element: renderRoute('/office-map', <PrototypePlaceholderPage {...getPrototypePlaceholder('/office-map')} />),
    },
    {
        path: '/organization/structure',
        element: renderRoute(
            '/organization/structure',
            <PrototypePlaceholderPage {...getPrototypePlaceholder('/organization/structure')} />,
        ),
    },
    {
        path: '/committees',
        element: renderRoute('/committees', <PrototypePlaceholderPage {...getPrototypePlaceholder('/committees')} />),
    },
    {
        path: '/externals/integrations',
        element: renderRoute(
            '/externals/integrations',
            <PrototypePlaceholderPage {...getPrototypePlaceholder('/externals/integrations')} />,
        ),
    },
    {
        path: '*',
        element: <Navigate replace to="/" />,
    },
];
