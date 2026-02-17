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
            <section className="page-section">
                <h1 className="page-title">{t('employeeDirectory.title')}</h1>
                <p className="status-message">{t('employeeDirectory.states.loading')}</p>
            </section>
        );
    }

    if (result.kind === 'success') {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('employeeDirectory.title')}</h1>
                {result.source === 'temporary-stub' ? (
                    <p className="helper-note">{t('employeeDirectory.states.temporaryAdapter')}</p>
                ) : null}
                <div className="data-table-shell">
                    <table className="data-table">
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
                </div>
            </section>
        );
    }

    if (result.kind === 'empty') {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('employeeDirectory.title')}</h1>
                <p className="status-message">{t('employeeDirectory.states.empty')}</p>
            </section>
        );
    }

    if (result.kind === 'notFound') {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('employeeDirectory.title')}</h1>
                <p className="status-message">{t('employeeDirectory.states.notFound')}</p>
            </section>
        );
    }

    if (result.kind === 'unauthorized') {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('employeeDirectory.title')}</h1>
                <p className="status-message">{t('employeeDirectory.states.unauthorized')}</p>
            </section>
        );
    }

    if (result.kind === 'forbidden') {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('employeeDirectory.title')}</h1>
                <p className="status-message">{t('employeeDirectory.states.forbidden')}</p>
            </section>
        );
    }

    if (result.kind === 'badRequest') {
        return (
            <section className="page-section">
                <h1 className="page-title">{t('employeeDirectory.title')}</h1>
                <p className="status-message">{t('employeeDirectory.states.badRequest')}</p>
            </section>
        );
    }

    return (
        <section className="page-section">
            <h1 className="page-title">{t('employeeDirectory.title')}</h1>
            <p className="status-message">{t('employeeDirectory.states.error')}</p>
        </section>
    );
}
