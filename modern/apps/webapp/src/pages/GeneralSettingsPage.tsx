import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchGeneralSettings, type GeneralSettingsResult } from '../api/generalSettings';
import { CardChrome, SectionHeader } from '../app/ui/primitives';

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
            <section aria-labelledby="general-settings-title" className="page-section">
                <SectionHeader
                    title={t('generalSettings.title')}
                    titleAs="h1"
                    titleClassName="page-title"
                    titleId="general-settings-title"
                />
                <p className="status-message" role="status">
                    {t('generalSettings.states.loading')}
                </p>
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
            <section aria-labelledby="general-settings-title" className="page-section">
                <SectionHeader
                    title={t('generalSettings.title')}
                    titleAs="h1"
                    titleClassName="page-title"
                    titleId="general-settings-title"
                />
                <p className="helper-note">{t('generalSettings.meta.readOnly')}</p>
                <dl className="info-grid">
                    <CardChrome as="div" className="info-card">
                        <dt>{t('generalSettings.fields.language')}</dt>
                        <dd>{selectedLanguage}</dd>
                    </CardChrome>
                    <CardChrome as="div" className="info-card">
                        <dt>{t('generalSettings.fields.timeZone')}</dt>
                        <dd>{selectedTimeZone}</dd>
                    </CardChrome>
                </dl>
            </section>
        );
    }

    if (result.kind === 'empty') {
        return (
            <section aria-labelledby="general-settings-title" className="page-section">
                <SectionHeader
                    title={t('generalSettings.title')}
                    titleAs="h1"
                    titleClassName="page-title"
                    titleId="general-settings-title"
                />
                <p className="status-message status-message--warning" role="alert">
                    {t('generalSettings.states.empty')}
                </p>
            </section>
        );
    }

    if (result.kind === 'unauthorized') {
        return (
            <section aria-labelledby="general-settings-title" className="page-section">
                <SectionHeader
                    title={t('generalSettings.title')}
                    titleAs="h1"
                    titleClassName="page-title"
                    titleId="general-settings-title"
                />
                <p className="status-message status-message--warning" role="alert">
                    {t('generalSettings.states.unauthorized')}
                </p>
            </section>
        );
    }

    if (result.kind === 'forbidden') {
        return (
            <section aria-labelledby="general-settings-title" className="page-section">
                <SectionHeader
                    title={t('generalSettings.title')}
                    titleAs="h1"
                    titleClassName="page-title"
                    titleId="general-settings-title"
                />
                <p className="status-message status-message--warning" role="alert">
                    {t('generalSettings.states.forbidden')}
                </p>
            </section>
        );
    }

    if (result.kind === 'badRequest') {
        return (
            <section aria-labelledby="general-settings-title" className="page-section">
                <SectionHeader
                    title={t('generalSettings.title')}
                    titleAs="h1"
                    titleClassName="page-title"
                    titleId="general-settings-title"
                />
                <p className="status-message status-message--error" role="alert">
                    {t('generalSettings.states.badRequest')}
                </p>
            </section>
        );
    }

    const message =
        result.kind === 'serverError' || result.kind === 'unknownError'
            ? t('generalSettings.states.apiUnavailable')
            : t('generalSettings.states.error');

    return (
        <section aria-labelledby="general-settings-title" className="page-section">
            <SectionHeader
                title={t('generalSettings.title')}
                titleAs="h1"
                titleClassName="page-title"
                titleId="general-settings-title"
            />
            <p className="status-message status-message--error" role="alert">
                {message}
            </p>
            <p className="helper-note">{t('generalSettings.meta.fallbackHint')}</p>
        </section>
    );
}
