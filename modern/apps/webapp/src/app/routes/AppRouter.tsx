import { Navigate, type RouteObject } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { HealthPage } from '../../pages/HealthPage';
import { HomePage } from '../../pages/HomePage';
import { GeneralSettingsPage } from '../../pages/GeneralSettingsPage';
import { UserInfoPage } from '../../pages/UserInfoPage';

export const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: (
            <AppLayout>
                <HomePage />
            </AppLayout>
        ),
    },
    {
        path: '/health',
        element: (
            <AppLayout>
                <HealthPage />
            </AppLayout>
        ),
    },
    {
        path: '/user-info',
        element: (
            <AppLayout>
                <UserInfoPage />
            </AppLayout>
        ),
    },
    {
        path: '/settings/general',
        element: (
            <AppLayout>
                <GeneralSettingsPage />
            </AppLayout>
        ),
    },
    {
        path: '*',
        element: <Navigate replace to="/" />,
    },
];
