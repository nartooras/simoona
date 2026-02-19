import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchUserInfo, type UserInfoResult } from '../api/userInfo';
import { CardChrome, SectionHeader } from '../app/ui/primitives';

export function UserInfoPage() {
    const { t } = useTranslation();
    const [result, setResult] = useState<UserInfoResult | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadUserInfo() {
            const response = await fetchUserInfo();

            if (isMounted) {
                setResult(response);
            }
        }

        void loadUserInfo();

        return () => {
            isMounted = false;
        };
    }, []);

    if (result === null) {
        return (
            <section aria-labelledby="user-info-title" className="page-section">
                <SectionHeader title={t('userInfo.title')} titleAs="h1" titleClassName="page-title" titleId="user-info-title" />
                <p className="status-message" role="status">
                    {t('userInfo.states.loading')}
                </p>
            </section>
        );
    }

    if (result.kind === 'success') {
        const { userInfo } = result;

        return (
            <section aria-labelledby="user-info-title" className="page-section">
                <SectionHeader title={t('userInfo.title')} titleAs="h1" titleClassName="page-title" titleId="user-info-title" />
                <p className="helper-note">{t('userInfo.meta.readOnly')}</p>
                <dl className="info-grid">
                    <CardChrome as="div" className="info-card">
                        <dt>{t('userInfo.fields.fullName')}</dt>
                        <dd>{userInfo.fullName || t('userInfo.fallback.notAvailable')}</dd>
                    </CardChrome>
                    <CardChrome as="div" className="info-card">
                        <dt>{t('userInfo.fields.email')}</dt>
                        <dd>{userInfo.email ?? t('userInfo.fallback.notAvailable')}</dd>
                    </CardChrome>
                    <CardChrome as="div" className="info-card">
                        <dt>{t('userInfo.fields.userName')}</dt>
                        <dd>{userInfo.userName ?? t('userInfo.fallback.notAvailable')}</dd>
                    </CardChrome>
                    <CardChrome as="div" className="info-card">
                        <dt>{t('userInfo.fields.organizationId')}</dt>
                        <dd>{userInfo.organizationId}</dd>
                    </CardChrome>
                    <CardChrome as="div" className="info-card">
                        <dt>{t('userInfo.fields.cultureCode')}</dt>
                        <dd>{userInfo.cultureCode ?? t('userInfo.fallback.notAvailable')}</dd>
                    </CardChrome>
                    <CardChrome as="div" className="info-card">
                        <dt>{t('userInfo.fields.timeZone')}</dt>
                        <dd>{userInfo.timeZone ?? t('userInfo.fallback.notAvailable')}</dd>
                    </CardChrome>
                </dl>
            </section>
        );
    }

    if (result.kind === 'unauthorized') {
        return (
            <section aria-labelledby="user-info-title" className="page-section">
                <SectionHeader title={t('userInfo.title')} titleAs="h1" titleClassName="page-title" titleId="user-info-title" />
                <p className="status-message status-message--warning" role="alert">
                    {t('userInfo.states.unauthorized')}
                </p>
            </section>
        );
    }

    if (result.kind === 'notFound') {
        return (
            <section aria-labelledby="user-info-title" className="page-section">
                <SectionHeader title={t('userInfo.title')} titleAs="h1" titleClassName="page-title" titleId="user-info-title" />
                <p className="status-message status-message--warning" role="alert">
                    {t('userInfo.states.notFound')}
                </p>
            </section>
        );
    }

    if (result.kind === 'badRequest') {
        return (
            <section aria-labelledby="user-info-title" className="page-section">
                <SectionHeader title={t('userInfo.title')} titleAs="h1" titleClassName="page-title" titleId="user-info-title" />
                <p className="status-message status-message--error" role="alert">
                    {t('userInfo.states.badRequest')}
                </p>
            </section>
        );
    }

    const message =
        result.kind === 'serverError' || result.kind === 'unknownError'
            ? t('userInfo.states.apiUnavailable')
            : t('userInfo.states.error');

    return (
        <section aria-labelledby="user-info-title" className="page-section">
            <SectionHeader title={t('userInfo.title')} titleAs="h1" titleClassName="page-title" titleId="user-info-title" />
            <p className="status-message status-message--error" role="alert">
                {message}
            </p>
            <p className="helper-note">{t('userInfo.meta.fallbackHint')}</p>
        </section>
    );
}
