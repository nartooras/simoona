import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchGeneralSettings, type GeneralSettingsResult } from '../api/generalSettings';

export function GeneralSettingsPage() {
    const { t } = useTranslation();
    const [result, setResult] = useState<GeneralSettingsResult | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadSettings() {
            const response = await fetchGeneralSettings();

            if (isMounted) {
                setResult(response);
            }
        }

        void loadSettings();

        return () => {
            isMounted = false;
        };
    }, []);

    if (result === null) {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('generalSettings.title')}</h1>
                <p className="status-message">{t('generalSettings.states.loading')}</p>
            </section>
        );
    }

    if (result.kind === 'success') {
        const selectedLanguage =
            result.settings.languages.find((language) => language.isSelected)?.displayName ??
            t('generalSettings.fallback.notAvailable');
        const selectedTimeZone =
            result.settings.timeZones.find((timeZone) => timeZone.isSelected)?.displayName ??
            t('generalSettings.fallback.notAvailable');

        return (
            <section className="page-section">
                <h1 className="page-title">{t('generalSettings.title')}</h1>
                <dl className="info-grid">
                    <div className="info-card">
                        <dt>{t('generalSettings.fields.language')}</dt>
                        <dd>{selectedLanguage}</dd>
                    </div>
                    <div className="info-card">
                        <dt>{t('generalSettings.fields.timeZone')}</dt>
                        <dd>{selectedTimeZone}</dd>
                    </div>
                </dl>
            </section>
        );
    }

    if (result.kind === 'empty') {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('generalSettings.title')}</h1>
                <p className="status-message">{t('generalSettings.states.empty')}</p>
            </section>
        );
    }

    if (result.kind === 'unauthorized') {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('generalSettings.title')}</h1>
                <p className="status-message">{t('generalSettings.states.unauthorized')}</p>
            </section>
        );
    }

    if (result.kind === 'forbidden') {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('generalSettings.title')}</h1>
                <p className="status-message">{t('generalSettings.states.forbidden')}</p>
            </section>
        );
    }

    if (result.kind === 'badRequest') {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('generalSettings.title')}</h1>
                <p className="status-message">{t('generalSettings.states.badRequest')}</p>
            </section>
        );
    }

    return (
        <section className="page-section">
            <h1 className="page-title">{t('generalSettings.title')}</h1>
            <p className="status-message">{t('generalSettings.states.error')}</p>
        </section>
    );
}
