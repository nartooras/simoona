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
            <section aria-labelledby="employee-directory-title" className="page-section">
                <h1 className="page-title" id="employee-directory-title">
                    {t('employeeDirectory.title')}
                </h1>
                <p className="status-message" role="status">
                    {t('employeeDirectory.states.loading')}
                </p>
            </section>
        );
    }

    if (result.kind === 'success') {
        return (
            <section aria-labelledby="employee-directory-title" className="page-section">
                <h1 className="page-title" id="employee-directory-title">
                    {t('employeeDirectory.title')}
                </h1>
                <p className="helper-note">{t('employeeDirectory.meta.readOnly')}</p>
                <div className="data-table-shell">
                    <table className="data-table">
                        <caption>{t('employeeDirectory.meta.caption')}</caption>
                        <thead>
                            <tr>
                                <th scope="col">{t('employeeDirectory.fields.name')}</th>
                                <th scope="col">{t('employeeDirectory.fields.jobTitle')}</th>
                                <th scope="col">{t('employeeDirectory.fields.email')}</th>
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
            <section aria-labelledby="employee-directory-title" className="page-section">
                <h1 className="page-title" id="employee-directory-title">
                    {t('employeeDirectory.title')}
                </h1>
                <p className="status-message status-message--warning" role="alert">
                    {t('employeeDirectory.states.empty')}
                </p>
            </section>
        );
    }

    if (result.kind === 'notFound') {
        return (
            <section aria-labelledby="employee-directory-title" className="page-section">
                <h1 className="page-title" id="employee-directory-title">
                    {t('employeeDirectory.title')}
                </h1>
                <p className="status-message status-message--warning" role="alert">
                    {t('employeeDirectory.states.notFound')}
                </p>
            </section>
        );
    }

    if (result.kind === 'unauthorized') {
        return (
            <section aria-labelledby="employee-directory-title" className="page-section">
                <h1 className="page-title" id="employee-directory-title">
                    {t('employeeDirectory.title')}
                </h1>
                <p className="status-message status-message--warning" role="alert">
                    {t('employeeDirectory.states.unauthorized')}
                </p>
            </section>
        );
    }

    if (result.kind === 'forbidden') {
        return (
            <section aria-labelledby="employee-directory-title" className="page-section">
                <h1 className="page-title" id="employee-directory-title">
                    {t('employeeDirectory.title')}
                </h1>
                <p className="status-message status-message--warning" role="alert">
                    {t('employeeDirectory.states.forbidden')}
                </p>
            </section>
        );
    }

    if (result.kind === 'badRequest') {
        return (
            <section aria-labelledby="employee-directory-title" className="page-section">
                <h1 className="page-title" id="employee-directory-title">
                    {t('employeeDirectory.title')}
                </h1>
                <p className="status-message status-message--error" role="alert">
                    {t('employeeDirectory.states.badRequest')}
                </p>
            </section>
        );
    }

    const message =
        result.kind === 'serverError' || result.kind === 'unknownError'
            ? t('employeeDirectory.states.apiUnavailable')
            : t('employeeDirectory.states.error');

    return (
        <section aria-labelledby="employee-directory-title" className="page-section">
            <h1 className="page-title" id="employee-directory-title">
                {t('employeeDirectory.title')}
            </h1>
            <p className="status-message status-message--error" role="alert">
                {message}
            </p>
            <p className="helper-note">{t('employeeDirectory.meta.fallbackHint')}</p>
        </section>
    );
}
