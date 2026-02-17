# Auth Migration Strategy (Legacy -> Modern)

## Purpose and Scope

This strategy defines how authentication and authorization should migrate from the legacy OWIN stack (`src/api/**`) to the modern API/webapp stack (`modern/**`) without breaking tenant/organization isolation.

This is a documentation-first plan. It does not change legacy runtime behavior.

## Legacy Auth Summary (Current)

## Protocols and session artifacts

- Legacy API uses OWIN OAuth2 with `/token` (`ApplicationOAuthProvider`) and refresh tokens (`RefreshTokenProvider`) in `src/api/Shrooms.Presentation.Api/App_Start/Startup.Auth.cs`.
- Access token authentication uses bearer middleware. Cookie auth also exists for signed-in web sessions.
- SignalR supports query-string token extraction for `/signalr` via `QueryStringBearerAuthProvider`.
- Refresh tokens are persisted server-side (hashed id), include `Subject` (user id), org id, issued/expiry timestamps, and are one-time use on redemption.

## Providers and login flows

- Internal username/password login is supported.
- External login providers: Google, Facebook, Microsoft; enabled via app settings.
- Provider redirect flow applies organization-aware restrictions (for example email-domain restrictions per org).

## Claims and identity shape

- Key legacy claims include:
  - `nameidentifier` (`GetUserId`)
  - `OrganizationId`
  - `OrganizationName`
  - `given_name`
  - impersonation claims: `UserImpersonation`, `OriginalUsername`
- Claims are added by `ShroomsClaimsIdentityFactory` and consumed widely by authorization and data access.

## Tenant/org resolution behavior

- Legacy middleware resolves tenant (`tenantName`) from path/header/query/authenticated claim, then validates it.
- Tenant header conventions include legacy `Organization` and path/query usage.
- Many flows require tenant context before login completes (for example `/token`, external login routes, account flows).

## Authorization behavior

- Legacy uses `[Authorize]` plus custom permission checks (`PermissionAuthorizeAttribute`) that evaluate permissions by `(userId, organizationId)`.
- Tenant/org scoping is a central security boundary across controllers/services.

## Modern Target Auth Model (API + Webapp)

## Principles

- Single primary trust model: signed JWT access token validated by modern API.
- Explicit tenant/org resolution model with deterministic precedence and conflict checks.
- Policy-based authorization in API; no endpoint-specific ad hoc permission branching.
- No trust in client-supplied tenant/org headers without cross-check against authenticated claims.

## Modern API target

- Authenticate with `JwtBearer` only for protected endpoints.
- Validate issuer, audience, signature, lifetime, and token type in non-dev environments.
- Resolve canonical identity from claims, with standardized claim names (see Canonical Claims section).
- Run tenant-context middleware after authentication and before endpoint execution.
- Enforce tenant/org authorization with reusable policies/requirements.

## Modern webapp target

- Use Authorization Code + PKCE with centralized IdP (or migration-compatible token service).
- Keep tokens out of URLs and avoid localStorage where feasible; prefer secure session strategy/BFF if adopted.
- Send correlation id and explicit tenant context only when required by API contract.
- Remove any long-term dependence on debug headers (for example `X-User-Id`) outside local/testing.

## Trust Boundaries and Threat Model Highlights

## Primary boundaries

- Browser -> modern API: untrusted boundary.
- Modern API -> identity provider: trusted integration boundary with strict config.
- Modern API -> legacy DB: trusted backend boundary, least-privilege read/write separation.

## Priority threats to mitigate

- Tenant spoofing via `X-Org-Id` / `Organization` header manipulation.
- Confused deputy issues where valid user token is paired with another org header.
- Token replay from query strings, logs, or browser storage leaks.
- Refresh token theft or reuse.
- Privilege escalation through stale role/permission claims.
- Impersonation misuse without audit trails and explicit policy controls.

## Required controls

- Claim-vs-header org consistency checks.
- Strict auth scheme pinning per endpoint group.
- Short-lived access tokens and rotating refresh tokens.
- Auth event auditing with tenant/user/correlation context.
- Structured denial reasons (no sensitive detail leakage).

## Tenant/Org Resolution Rules and Conflict Handling

## Canonical resolution order

1. Authenticated token claims (authoritative source for org/tenant entitlement).
2. Explicit API header (`X-Org-Id`, optionally `X-Tenant-Id`) as requested context.
3. Legacy compatibility header (`Organization`) only in migration phase where needed.

## Conflict rules

- If token has org/tenant claim and header is missing: use claim.
- If header exists and claim missing: allow only for explicitly marked compatibility endpoints/phases.
- If both exist and mismatch: reject with `403` (security violation), emit audit event.
- If org header/claim is non-numeric where numeric required: reject with `400`.
- Never silently coerce one organization to another.

## Legacy mapping rules

- Legacy `OrganizationName` may be accepted only in adapters/transitional middleware.
- Modern policy enforcement should use canonical org id internally.
- Where needed, resolve org name -> org id using trusted backend lookup, not client input alone.

## Recommended Canonical Identity Claims

Required claims:

- `sub`: stable user id.
- `org_id`: canonical organization id.
- `tenant_id`: canonical tenant id (if distinct from org model).
- `iss`, `aud`, `exp`, `iat`, `nbf`, `jti`: token validation and replay controls.

Recommended claims:

- `name`, `given_name`, `family_name`, `email`.
- `role` (coarse roles).
- `permissions` (fine-grained permissions, if token size/latency tradeoff is acceptable).
- `act` or equivalent for impersonation actor metadata when impersonation is enabled.

Legacy-to-canonical mapping during migration:

- `ClaimTypes.NameIdentifier` -> `sub`
- `OrganizationId` -> `org_id`
- `OrganizationName` -> transitional resolver input only
- `UserImpersonation` + `OriginalUsername` -> modern impersonation metadata model

## Authorization Model (Roles, Permissions, Policies)

## Model

- Use policy-based authorization in modern API.
- Separate checks:
  - authentication policy (`AuthenticatedUser`)
  - tenant scope policy (`TenantContextMatchesIdentity`)
  - capability policies (for example `CanReadUserInfo`, `CanManageUsers`)

## Guidance

- Prefer permission-based checks for domain actions; keep role checks as coarse gates.
- Centralize permission translation (legacy permission names -> modern policy names) in one mapping module.
- For high-risk operations, require both permission and org-scope assertion.

## Session and Token Lifecycle

## Access tokens

- Short TTL (for example 5-15 minutes in prod), validated on each request.
- No query-string token transport outside tightly constrained legacy compatibility paths.

## Refresh tokens

- Rotation on each use; old token invalidated atomically.
- Bind refresh token family to client/session; detect reuse and revoke family.
- Persist only hashed token references server-side.

## Revocation and logout

- User logout revokes active refresh token family for user+org+client/session scope.
- Admin/security revocation supports immediate deny-list path for critical incidents.
- Consider back-channel logout or push revocation for high-security environments.

## Expiry defaults by environment

- Local dev/testing: relaxed expiries allowed only with explicit non-prod configuration.
- Staging/prod: production TTLs, rotation, and strict issuer/audience checks mandatory.

## Local/Dev Strategy vs Staging/Prod Strategy

## Local/Dev

- Allow test auth scheme and controlled header fallbacks (`X-Test-User-Id`, `X-User-Id`) only in Development/Testing.
- Keep mock tokens simple but include org claim test coverage.
- Document exact toggle flags so fallback cannot be enabled silently in production.

## Staging/Prod

- Disable all header-based user identity fallback.
- Require validated JWT from configured issuer.
- Enforce org claim/header conflict checks and alert on violations.
- Run periodic token/audit log integrity checks.

## Migration Phases and Exit Criteria

## Phase 0: Baseline and Guardrails

- Deliver this strategy + ADR + backlog mapping.
- Inventory legacy claims, permissions, and endpoint auth dependencies.
- Add policy naming conventions and auth event schema.

Exit criteria:

- Strategy and ADR approved by security + platform owners.
- Canonical claim schema documented and versioned.
- No modern endpoint merges without auth review checklist.

## Phase 1: Compatibility Foundation (Read-first)

- Keep current modern auth for existing endpoints, but introduce canonical claim resolver abstraction.
- Add org conflict detection and consistent problem responses.
- Keep header fallback limited to dev/testing or explicit compatibility endpoints.

Exit criteria:

- Protected modern endpoints enforce authenticated access.
- Tenant/org mismatch checks implemented and tested.
- No reliance on legacy-only claim names in new endpoint logic.

## Phase 2: Policy and Permission Convergence

- Introduce policy-based authorization requirements and handlers.
- Map priority legacy permissions to modern policies.
- Add audit events for allow/deny decisions with reason codes.

Exit criteria:

- Critical migrated endpoints use policies, not ad hoc permission checks.
- Permission mapping documented and reviewed.
- Unauthorized/forbidden behavior contract-tested.

## Phase 3: Token Service Hardening and Webapp Transition

- Move modern webapp to production-grade token acquisition (Auth Code + PKCE or approved BFF pattern).
- Enforce strict JWT validation settings in staging/prod.
- Remove non-essential compatibility headers from modern webapp requests.

Exit criteria:

- Modern webapp auth flow validated end-to-end in staging.
- Refresh token rotation/revocation behaviors tested.
- Security sign-off for production cutover scope.

## Phase 4: Cutover and Legacy Decommission Path

- Route migrated journeys fully to modern auth + modern endpoints.
- Lock down remaining legacy auth surfaces to unmigrated capabilities only.
- Plan and execute incremental retirement of legacy auth dependencies.

Exit criteria:

- Target journeys no longer depend on legacy auth runtime.
- Incident runbooks and rollback paths validated.
- Decommission checklist approved.

## Cutover and Rollback Strategy

## Cutover

- Use feature flags / route-level switching per journey.
- Roll out by tenant cohorts or internal users first.
- Keep dual-readiness period with clear source of auth truth per route.

## Rollback

- Maintain reversible routing (modern -> legacy) per endpoint group during rollout windows.
- Keep legacy token endpoints operational until modern auth stability SLO is met.
- Trigger rollback on predefined thresholds (auth error spike, org mismatch anomalies, elevated 401/403 rates).

## Observability and Audit Requirements

Auth events to log/metric:

- Login success/failure by provider and reason.
- Token issued/refreshed/revoked/reuse-detected.
- Authorization deny decisions with policy + reason code.
- Tenant/org mismatch rejections.
- Impersonation start/stop events with actor/subject metadata.

Minimum fields:

- `timestamp`, `environment`, `service`, `correlation_id`, `request_id`
- `user_id` (or anonymous marker), `org_id`, `tenant_id`
- `client_id`/app id, auth scheme, endpoint, decision/outcome, failure reason

Operational requirements:

- Dashboard for auth failure rates and 401/403 trends.
- Alerting for abnormal mismatch/revocation/reuse signals.
- Retention and access controls aligned with security/compliance policy.

## Security Test Checklist (Must-Have)

Authentication tests:

- Valid JWT accepted for protected endpoint.
- Missing/invalid/expired JWT rejected.
- Wrong issuer/audience/signature rejected.

Tenant/org isolation tests:

- Cross-org access attempt with mismatched header/claim returns `403`.
- Missing org context behavior matches endpoint contract (`400` or policy deny).
- Legacy header compatibility paths cannot bypass org checks.

Authorization tests:

- Required policy/permission enforced (positive + negative).
- Role-only user without permission denied when permission is required.

Token lifecycle tests:

- Refresh token rotation invalidates previous token.
- Reuse of rotated refresh token is detected and revokes token family.
- Logout revokes refresh token(s) for session scope.

Impersonation and audit tests:

- Impersonation requires explicit authorization and emits audit events.
- Impersonated actions include actor/subject traceability.

Security hardening tests:

- No auth tokens leaked in logs/query strings for modern endpoints.
- Header-based dev fallbacks are disabled in staging/prod.
- Rate limiting / lockout behavior validated for login and refresh abuse scenarios.

## Implementation Guardrails for Threads

- Any auth-related endpoint change in `modern/**` must reference:
  - this strategy (`modern/docs/auth-migration.md`)
  - ADR 0003 (`modern/docs/adr/0003-auth-migration-strategy.md`)
- Do not change legacy runtime auth behavior in `src/api/**` or `src/webapp/**` as part of modern auth migration threads unless explicitly requested.
- Favor incremental policy introduction over large cross-cutting refactors.
