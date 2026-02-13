import { Navigate, type RouteObject } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { HealthPage } from '../../pages/HealthPage';
import { HomePage } from '../../pages/HomePage';

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
        path: '*',
        element: <Navigate replace to="/" />,
    },
];
