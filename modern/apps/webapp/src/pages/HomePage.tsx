import { useTranslation } from 'react-i18next';

export function HomePage() {
    const { t } = useTranslation();

    return (
        <section className="page-section">
            <h1 className="page-title">{t('home.title')}</h1>
            <p className="status-message">{t('home.welcomeMessage')}</p>
            <p className="helper-note">Demo-ready shell baseline: consistent real, mock, and disabled route framing.</p>
            <dl className="info-grid">
                <div className="info-card">
                    <dt>Migration scope</dt>
                    <dd>Wave 1 and Wave 2 read surfaces are active in the modern prototype shell.</dd>
                </div>
                <div className="info-card">
                    <dt>Prototype navigation parity</dt>
                    <dd>Legacy IA groups are represented: Activities, Company, Externals, and System.</dd>
                </div>
                <div className="info-card">
                    <dt>Current focus</dt>
                    <dd>Route availability labeling clarifies which areas are real, mock, or disabled.</dd>
                </div>
            </dl>
        </section>
    );
}
