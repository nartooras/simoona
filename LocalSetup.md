# Installation from Binaries (Legacy Runtime)

This document describes the legacy Windows/IIS installation path.

For active modernization work, use `app/**` workflows and follow `AGENTS.md` + `app/docs/orchestration/*`.

## Required Software

1. Internet Information Services (IIS) Server (<https://www.iis.net/>)
2. IIS URL Rewrite extension (<https://www.iis.net/downloads/microsoft/url-rewrite>)
3. SQL Server Express (<https://www.microsoft.com/en-us/sql-server/sql-server-editions-express>)

## Installation Process

1. Download the latest stable package from [Simoona releases](https://github.com/VismaLietuva/simoona/releases).
2. Unzip the package to a target directory.
3. Execute `install.bat` as Administrator and provide MSSQL connection string.
4. After successful setup, open `http://app.simoona.local`.

Default legacy seed credentials:

- Organization name: `testorg`
- Username: `tester@example.com`
- Password: `testerPass123`
