# Simoona Agent Quickstart

This file is a fast orientation guide for AI agents and contributors.

## 1) What This Repository Is

- Product: **Simoona** (open-source intranet platform).
- Architecture: legacy split app:
  - `src/webapp`: AngularJS 1.x frontend.
  - `src/api`: ASP.NET Web API + OWIN backend on .NET Framework.
- Automation/setup scripts: `build/` (Windows/IIS/SQL Server oriented).

Current snapshot note:
- This checkout does **not** currently contain `modern/` directories yet.
- Existing AGENTS modernization guardrails still apply when working on modernization threads.

## 2) Repository Layout (High Value Paths)

- Root docs:
  - `README.md`
  - `LocalSetup.md`
  - `build/README.md`
- Frontend:
  - `src/webapp/README.md`
  - `src/webapp/package.json`
  - `src/webapp/bower.json`
  - `src/webapp/gulpfile.js`
  - `src/webapp/gulp.config.js`
  - `src/webapp/src/client/app/` (feature modules)
  - `src/webapp/src/server/app.js` (local static/dev server)
- Backend:
  - `src/api/README.md`
  - `src/api/Shrooms.sln`
  - `src/api/Targets/shared.targets` (global .NET settings)
  - `src/api/Shrooms.Presentation.Api/Startup.cs`
  - `src/api/Shrooms.Presentation.Api/Web.config`
  - `src/api/Shrooms.Presentation.Api/Controllers/`
  - `src/api/Shrooms.DataLayer/Migrations/`
- Build/bootstrap:
  - `build/build.bat`
  - `build/build.cake`
  - `build/initial_db.sql`
  - `build/admin.sql`
  - `build/background_jobs.sql`

## 3) Tech Stack Snapshot

Frontend (`src/webapp`):
- AngularJS 1.5.x + `ui-router`
- Gulp 4 build pipeline
- Bower-managed browser deps
- Karma + Jasmine tests
- Express dev/static server (`src/server/app.js`)

Backend (`src/api`):
- .NET Framework `net472` (from `src/api/Targets/shared.targets`)
- ASP.NET Web API + OWIN startup (`Startup.cs`)
- Entity Framework 6 (code-first migrations in `Shrooms.DataLayer`)
- Autofac DI, Hangfire background jobs, SignalR, Swashbuckle

Infra assumptions:
- IIS + IIS URL Rewrite
- SQL Server / SQL Express
- Visual Studio (2019 recommended in docs)
- Windows-first setup scripts

## 4) How The App Is Composed

High-level request flow:

1. Browser loads AngularJS app from webapp build/dev server.
2. AngularJS calls backend API (default `http://localhost:50321`).
3. Backend runs OWIN middleware, Web API controllers, EF data access.
4. Optional integrations: email SMTP, social login, blob storage, Hangfire jobs.

Backend layering by project names:
- Contracts: `Shrooms.Contracts*`
- Data: `Shrooms.DataLayer*`
- Domain: `Shrooms.Domain*`
- Infrastructure: `Shrooms.Infrastructure`
- Composition root: `Shrooms.IoC`
- Presentation/API: `Shrooms.Presentation.Api`, `Shrooms.Presentation.Common`
- Tests: `Shrooms.Tests`, `Shrooms.Premium.Tests`

## 5) Fast Local Run Options

### Option A: Full legacy bootstrap (Windows/IIS path)

From repo root:

```bash
cd build
build.bat
```

What it does (via Cake/Yeoman scripts):
- Creates DBs (`SimoonaDB`, `SimoonaDBJobs`)
- Injects organization + connection strings into API `Web.config`
- Restores/builds API and webapp
- Creates IIS sites/app pool and hosts entry

### Option B: Run parts manually

Frontend:

```bash
cd src/webapp
npm install
bower install
gulp serve-dev
```

Backend:
- Open `src/api/Shrooms.sln`.
- Set startup project to `Shrooms.Presentation.Api`.
- Run/debug in Visual Studio or build with MSBuild-compatible tooling.

## 6) Important Configuration Touchpoints

Backend config:
- `src/api/Shrooms.Presentation.Api/Web.config`
  - `RegisteredOrganizations`
  - `<connectionStrings>` (main org DB + `BackgroundJobs`)
  - `ClientUrl`, `ApiUrl`, `OAuthRedirectUri`
  - SMTP settings (`system.net/mailSettings`)
  - Optional provider and storage settings

Frontend config:
- `src/webapp/gulp.config.js`
  - `defaultBuildConfig.endpoint`
  - `productionBuildConfig.endpoint`
  - locale list, build paths, default dev port (`7203`)

## 7) Feature Map (Frontend)

Main AngularJS feature directories under `src/webapp/src/client/app/` include:
- `auth`, `wall`, `kudos`, `events`, `profile`, `users`, `settings`,
- `customization`, `lotteries`, `support`, `office`, `widget`, and more.

Shared frontend utilities:
- `common/` (directives, filters, services)
- `layout/` (navigation/left menu)

## 8) Working Rules For Agents (From Repo Instructions)

- Modernization work is expected under `modern/**` when present.
- Legacy runtime paths are protected unless explicitly requested:
  - `src/webapp/**`
  - `src/api/**`
- Keep generated artifacts out of commits:
  - `node_modules/`, `dist/`, `bin/`, `obj/`, `.vite/`
- Avoid destructive git operations unless explicitly requested.
- Use focused `codex/*` branches per thread objective.

## 9) Quick Stats (This Checkout)

- Total tracked files: ~3382
- C# files: ~1670
- JavaScript files: ~486
- C# projects (`.csproj`): 18
- API controller classes: 34
- Top-level frontend app feature modules: 31

## 10) First 15 Minutes Checklist For New Agents

1. Read `README.md`, `src/webapp/README.md`, `src/api/README.md`.
2. Confirm target area (legacy vs modernization) and guardrails.
3. Inspect affected feature module in `src/webapp/src/client/app/*`.
4. Trace matching backend controller/service path from `Shrooms.Presentation.Api`.
5. Verify config dependencies in `Web.config` and `gulp.config.js`.
6. Run only relevant build/test commands for changed area.
