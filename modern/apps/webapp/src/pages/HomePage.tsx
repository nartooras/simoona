import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchHomeExperience, type HomeSectionState } from '../api/homeExperience';
import { WallExperienceColumns } from '../app/wall/WallExperienceColumns';
import { SectionHeader } from '../app/ui/primitives';

function formatSectionSourceLabel(section: HomeSectionState<unknown>): string {
    if (section.adapter === 'real') {
        return 'real API';
    }

    if (section.adapter === 'mock') {
        return 'mock fixtures';
    }

    return 'disabled';
}

export function HomePage() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Awaited<ReturnType<typeof fetchHomeExperience>> | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadHomeExperience() {
            const response = await fetchHomeExperience();

            if (!isMounted) {
                return;
            }

            setResult(response);
        }

        void loadHomeExperience();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section aria-label="Wall page" className="wall-page">
            <SectionHeader
                className="wall-page-header"
                meta={
                    result ? (
                        <span data-testid="wall-data-source-summary">
                            Feed source: {formatSectionSourceLabel(result.feed)} · Widgets source:{' '}
                            {formatSectionSourceLabel(result.widgets)}
                        </span>
                    ) : undefined
                }
                metaClassName="wall-data-source-summary"
                subtitle="Core wall stream with compact parity-ready feed and right-rail density."
                subtitleClassName="wall-page-subtitle"
                title={t('home.title')}
                titleAs="h1"
                titleClassName="page-title"
            />
            <WallExperienceColumns result={result} />
        </section>
    );
}
