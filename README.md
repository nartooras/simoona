# Simoona

Simoona is an open-source intranet platform.

## Repository Modes

This repository currently contains two tracks:

- Legacy runtime (source of behavior truth):
  - `src/webapp` (AngularJS)
  - `src/api` (.NET Framework Web API)
  - `build` (legacy setup scripts)
- Modernization runtime (active delivery area):
  - `app/web`
  - `app/api`
  - `app/packages/*`
  - `app/tests/*`

## Modernization Status (Current)

- Modernization branch: `modernization`
- Legacy parity target: **100% feature and behavior parity** before production release unfreeze.
- Production release policy: frozen by default until parity gates are fully green.
- Governance source of truth:
  - `app/docs/orchestration/status.md`
  - `app/docs/orchestration/backlog.md`
  - `app/docs/orchestration/risks.md`
  - `app/docs/orchestration/decisions.md`
  - `app/docs/orchestration/evidence.md`

## Agent and Contributor Rules

- Read `AGENTS.md` first.
- Use relevant skills when available (`app/skills/*`).
- Do not modify `src/**` or `build/**` during modernization work unless explicitly requested.
- Keep generated artifacts out of commits.

## Legacy Installation Paths

- Binary install instructions: `LocalSetup.md`
- Full legacy source bootstrap: `build/README.md`

## Legacy Development References

- Frontend: `src/webapp/README.md`
- Backend: `src/api/README.md`
