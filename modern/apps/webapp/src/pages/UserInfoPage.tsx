import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchUserInfo, type UserInfoResult } from '../api/userInfo';

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
            <section>
                <h1>{t('userInfo.title')}</h1>
                <p>{t('userInfo.states.loading')}</p>
            </section>
        );
    }

    if (result.kind === 'success') {
        const { userInfo } = result;

        return (
            <section>
                <h1>{t('userInfo.title')}</h1>
                <dl className="user-info-list">
                    <div>
                        <dt>{t('userInfo.fields.fullName')}</dt>
                        <dd>{userInfo.fullName || t('userInfo.fallback.notAvailable')}</dd>
                    </div>
                    <div>
                        <dt>{t('userInfo.fields.email')}</dt>
                        <dd>{userInfo.email ?? t('userInfo.fallback.notAvailable')}</dd>
                    </div>
                    <div>
                        <dt>{t('userInfo.fields.userName')}</dt>
                        <dd>{userInfo.userName ?? t('userInfo.fallback.notAvailable')}</dd>
                    </div>
                    <div>
                        <dt>{t('userInfo.fields.organizationId')}</dt>
                        <dd>{userInfo.organizationId}</dd>
                    </div>
                    <div>
                        <dt>{t('userInfo.fields.cultureCode')}</dt>
                        <dd>{userInfo.cultureCode ?? t('userInfo.fallback.notAvailable')}</dd>
                    </div>
                    <div>
                        <dt>{t('userInfo.fields.timeZone')}</dt>
                        <dd>{userInfo.timeZone ?? t('userInfo.fallback.notAvailable')}</dd>
                    </div>
                </dl>
            </section>
        );
    }

    if (result.kind === 'unauthorized') {
        return (
            <section>
                <h1>{t('userInfo.title')}</h1>
                <p>{t('userInfo.states.unauthorized')}</p>
            </section>
        );
    }

    if (result.kind === 'notFound') {
        return (
            <section>
                <h1>{t('userInfo.title')}</h1>
                <p>{t('userInfo.states.notFound')}</p>
            </section>
        );
    }

    if (result.kind === 'badRequest') {
        return (
            <section>
                <h1>{t('userInfo.title')}</h1>
                <p>{t('userInfo.states.badRequest')}</p>
            </section>
        );
    }

    return (
        <section>
            <h1>{t('userInfo.title')}</h1>
            <p>{t('userInfo.states.error')}</p>
        </section>
    );
}
