import { useTranslation } from 'react-i18next';

export function HomePage() {
    const { t } = useTranslation();

    return (
        <section className="page-section">
            <h1 className="page-title">{t('home.title')}</h1>
            <p className="status-message">{t('home.welcomeMessage')}</p>
        </section>
    );
}
