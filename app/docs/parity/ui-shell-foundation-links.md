# UI Shell Foundation Links

Date: `2026-02-20`
Phase: `Phase 2 - Core Compatibility Layer`

This document links high-priority legacy shell routes/behaviors to modern shell foundation artifacts.

| legacy behavior | modern artifact | marker |
| --- | --- | --- |
| login boundary redirect to `/account/login` | `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/auth-boundary.ts` | `legacyLoginBoundary` |
| tenant-aware route normalization | `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/tenant-route-container.ts` | `legacyTenantRouteContainer` |
| top-level shell frame | `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/top-level-layout.ts` | `legacyTopLevelLayout` |

Validation command:

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web shell:check
```
