import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchMyProfile, type MyProfileResult } from '../api/myProfile';

export function MyProfilePage() {
    const { t } = useTranslation();
    const [result, setResult] = useState<MyProfileResult | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadProfile() {
            const response = await fetchMyProfile();

            if (isMounted) {
                setResult(response);
            }
        }

        void loadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    if (result === null) {
        return (
            <section>
                <h1>{t('myProfile.title')}</h1>
                <p>{t('myProfile.states.loading')}</p>
            </section>
        );
    }

    if (result.kind === 'success') {
        return (
            <section>
                <h1>{t('myProfile.title')}</h1>
                {result.source === 'temporary-stub' ? <p>{t('myProfile.states.temporaryAdapter')}</p> : null}
                <dl className="user-info-list">
                    <div>
                        <dt>{t('myProfile.fields.fullName')}</dt>
                        <dd>{result.profile.fullName || t('myProfile.fallback.notAvailable')}</dd>
                    </div>
                    <div>
                        <dt>{t('myProfile.fields.email')}</dt>
                        <dd>{result.profile.email ?? t('myProfile.fallback.notAvailable')}</dd>
                    </div>
                    <div>
                        <dt>{t('myProfile.fields.jobTitle')}</dt>
                        <dd>{result.profile.jobTitle ?? t('myProfile.fallback.notAvailable')}</dd>
                    </div>
                    <div>
                        <dt>{t('myProfile.fields.department')}</dt>
                        <dd>{result.profile.department ?? t('myProfile.fallback.notAvailable')}</dd>
                    </div>
                    <div>
                        <dt>{t('myProfile.fields.office')}</dt>
                        <dd>{result.profile.office ?? t('myProfile.fallback.notAvailable')}</dd>
                    </div>
                    <div>
                        <dt>{t('myProfile.fields.timeZone')}</dt>
                        <dd>{result.profile.timeZone ?? t('myProfile.fallback.notAvailable')}</dd>
                    </div>
                </dl>
            </section>
        );
    }

    if (result.kind === 'notFound') {
        return (
            <section>
                <h1>{t('myProfile.title')}</h1>
                <p>{t('myProfile.states.notFound')}</p>
            </section>
        );
    }

    if (result.kind === 'unauthorized') {
        return (
            <section>
                <h1>{t('myProfile.title')}</h1>
                <p>{t('myProfile.states.unauthorized')}</p>
            </section>
        );
    }

    if (result.kind === 'forbidden') {
        return (
            <section>
                <h1>{t('myProfile.title')}</h1>
                <p>{t('myProfile.states.forbidden')}</p>
            </section>
        );
    }

    if (result.kind === 'badRequest') {
        return (
            <section>
                <h1>{t('myProfile.title')}</h1>
                <p>{t('myProfile.states.badRequest')}</p>
            </section>
        );
    }

    return (
        <section>
            <h1>{t('myProfile.title')}</h1>
            <p>{t('myProfile.states.error')}</p>
        </section>
    );
}
