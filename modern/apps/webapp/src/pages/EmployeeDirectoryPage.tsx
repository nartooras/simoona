import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchEmployeeDirectory, type EmployeeDirectoryResult } from '../api/employeeDirectory';

export function EmployeeDirectoryPage() {
    const { t } = useTranslation();
    const [result, setResult] = useState<EmployeeDirectoryResult | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadDirectory() {
            const response = await fetchEmployeeDirectory();

            if (isMounted) {
                setResult(response);
            }
        }

        void loadDirectory();

        return () => {
            isMounted = false;
        };
    }, []);

    if (result === null) {
        return (
            <section>
                <h1>{t('employeeDirectory.title')}</h1>
                <p>{t('employeeDirectory.states.loading')}</p>
            </section>
        );
    }

    if (result.kind === 'success') {
        return (
            <section>
                <h1>{t('employeeDirectory.title')}</h1>
                {result.source === 'temporary-stub' ? (
                    <p>{t('employeeDirectory.states.temporaryAdapter')}</p>
                ) : null}
                <table>
                    <thead>
                        <tr>
                            <th>{t('employeeDirectory.fields.name')}</th>
                            <th>{t('employeeDirectory.fields.jobTitle')}</th>
                            <th>{t('employeeDirectory.fields.email')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.directory.pagedList.map((employee) => (
                            <tr key={employee.id}>
                                <td>{`${employee.firstName} ${employee.lastName}`.trim()}</td>
                                <td>{employee.jobTitle ?? t('employeeDirectory.fallback.notAvailable')}</td>
                                <td>{employee.email ?? t('employeeDirectory.fallback.notAvailable')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        );
    }

    if (result.kind === 'empty') {
        return (
            <section>
                <h1>{t('employeeDirectory.title')}</h1>
                <p>{t('employeeDirectory.states.empty')}</p>
            </section>
        );
    }

    if (result.kind === 'notFound') {
        return (
            <section>
                <h1>{t('employeeDirectory.title')}</h1>
                <p>{t('employeeDirectory.states.notFound')}</p>
            </section>
        );
    }

    if (result.kind === 'unauthorized') {
        return (
            <section>
                <h1>{t('employeeDirectory.title')}</h1>
                <p>{t('employeeDirectory.states.unauthorized')}</p>
            </section>
        );
    }

    if (result.kind === 'forbidden') {
        return (
            <section>
                <h1>{t('employeeDirectory.title')}</h1>
                <p>{t('employeeDirectory.states.forbidden')}</p>
            </section>
        );
    }

    if (result.kind === 'badRequest') {
        return (
            <section>
                <h1>{t('employeeDirectory.title')}</h1>
                <p>{t('employeeDirectory.states.badRequest')}</p>
            </section>
        );
    }

    return (
        <section>
            <h1>{t('employeeDirectory.title')}</h1>
            <p>{t('employeeDirectory.states.error')}</p>
        </section>
    );
}
