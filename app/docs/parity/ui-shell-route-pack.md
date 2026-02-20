# UI Shell Route Parity Pack

Date: `2026-02-20`
Phase: `Phase 3 - UI Parity Foundation and Design Modernization`

This route pack ties critical shell routes to modern shell compatibility handlers.

| legacy route | modern shell handler | marker |
| --- | --- | --- |
| `/account/login` | `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/auth-boundary.ts` | `legacyLoginBoundary` |
| `/{tenant}/...` tenant-prefixed routes | `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/tenant-route-container.ts` | `legacyTenantRouteContainer` |
| broad legacy route compatibility fallback | `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/legacy-route-catchup.ts` | `legacyRouteCatchupRegistry` |
| top navigation frame | `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/top-level-layout.ts` | `legacyTopNavFrame` |

Validation command:

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web shell:check
```
