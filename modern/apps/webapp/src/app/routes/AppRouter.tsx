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
        element: renderRoute(
            '/activities/feed',
            <PrototypePlaceholderPage
                cards={[
                    { title: 'Today posts', value: '18 sample updates loaded from static prototype data.' },
                    { title: 'Top topic', value: 'Quarterly planning milestones and team check-ins.' },
                    { title: 'Realtime status', value: 'Disabled in prototype; refresh is simulated every 30s.' },
                ]}
                summary="This feed demonstrates card density and information hierarchy while live event ingestion remains on legacy."
                title="Activity Feed"
            />,
        ),
    },
    {
        path: '/recognition',
        element: renderRoute(
            '/recognition',
            <PrototypePlaceholderPage
                cards={[
                    { title: 'Open recognitions', value: '12 draft shout-outs in this static preview set.' },
                    { title: 'Most thanked team', value: 'Customer Success (prototype snapshot).' },
                    { title: 'Nomination flow', value: 'Read-only visual flow for demo use; submit is not wired.' },
                ]}
                summary="Recognition cards are visual placeholders that mirror the planned IA location for social modules."
                title="Recognition"
            />,
        ),
    },
    {
        path: '/teams',
        element: renderRoute(
            '/teams',
            <PrototypePlaceholderPage
                cards={[
                    { title: 'Team directory', value: '7 example teams with synthetic headcount values.' },
                    { title: 'Capacity panel', value: 'Static utilization indicators for parity demonstration.' },
                    { title: 'Manager links', value: 'Profile deep-links are illustrative and not persisted.' },
                ]}
                summary="The teams area is included to preserve legacy IA expectations during prototype walkthroughs."
                title="Teams"
            />,
        ),
    },
    {
        path: '/externals/integrations',
        element: renderRoute(
            '/externals/integrations',
            <PrototypePlaceholderPage
                cards={[
                    { title: 'Marketplace', value: 'Disabled for this pass until partner API contracts are approved.' },
                    { title: 'Connector health', value: 'No live connector checks are executed in this prototype.' },
                    { title: 'Setup actions', value: 'Action buttons are intentionally removed to avoid false expectations.' },
                ]}
                summary="This area is visible for IA parity only and is intentionally marked unavailable for production use."
                title="Integrations"
            />,
        ),
    },
    {
        path: '*',
        element: <Navigate replace to="/" />,
    },
];
