# API Contract Baseline (Legacy -> Modern)

This baseline captures the first 10 high-value legacy endpoints to anchor migration contracts.

Selection criteria:
- business-critical user access/profile and people directory flows
- core wall/post/comment collaboration flows
- high-read endpoints used by dashboard/feed screens

Legacy routing note:
- attribute routes are enabled, and fallback route template is `/{controller}/{action}/{id}`.
- examples below use legacy runtime routes exactly as exposed by current controllers.

## 1) `GET /Account/UserInfo`
- Migration priority: `P1`
- Purpose: return the current user context used by shell/bootstrap flows.
- Request shape:
  - headers: `Authorization: Bearer <token>` (required for registered users)
  - no query/body
- Response shape:
  - `200 OK` (polymorphic):
    - registered user payload (`LoggedInUserInfoViewModel`): `email`, `hasRegistered`, `loginProvider`, `impersonated`, `organizationId`, `organizationName`, `permissions[]`, `roles[]`, `userId`, `userName`, `fullName`, `cultureCode`, `timeZone`, `pictureId`
    - external user payload (`ExternalUserInfoViewModel`): `email`, `hasRegistered`, `loginProvider`
  - common errors: `401 Unauthorized` (missing/invalid auth)
- Auth/tenant/org assumptions:
  - controller has `[Authorize]`
  - organization/tenant context is resolved from identity claims + OWIN tenant context
- Notes/risks:
  - response schema is union-shaped and client code often branches on `hasRegistered`.

## 2) `GET /User/GeneralSettings`
- Migration priority: `P1`
- Purpose: load localization preferences and selectable language/timezone options.
- Request shape:
  - headers: `Authorization: Bearer <token>`
  - no query/body
- Response shape:
  - `200 OK` (`LocalizationSettingsViewModel`):
    - `languages[]`: `displayName`, `name`, `isSelected`
    - `timeZones[]`: `id`, `displayName`, `isSelected`
  - common errors: `401 Unauthorized`, `403 Forbidden` (missing `BasicPermissions.ApplicationUser`)
- Auth/tenant/org assumptions:
  - `[Authorize]` + `[PermissionAuthorize(BasicPermissions.ApplicationUser)]`
  - user/org inferred from auth claims
- Notes/risks:
  - permission-gated, not just authentication-gated.

## 3) `PUT /User/GeneralSettings`
- Migration priority: `P1`
- Purpose: update per-user language/timezone.
- Request shape:
  - headers: `Authorization: Bearer <token>`
  - JSON body (`ChangeUserLocalizationSettingsViewModel`):
    - `languageCode` (required)
    - `timeZoneId` (required)
- Response shape:
  - `200 OK` (empty body)
  - common errors:
    - `400 Bad Request` with model-state errors for missing fields
    - `400 Bad Request` with validation payload `{ errorCode, errorMessage }`
    - `403 Forbidden` for missing permission
- Auth/tenant/org assumptions:
  - `[Authorize]` + `BasicPermissions.ApplicationUser`
  - organization/user IDs are injected server-side from claims
- Notes/risks:
  - two different `400` payload shapes exist (model-state vs domain validation object).

## 4) `GET /Employees`
- Migration priority: `P1`
- Purpose: paged employee directory listing.
- Request shape:
  - headers: `Authorization: Bearer <token>`
  - query (`EmployeeListingArgsViewModel`):
    - `search` (optional)
    - `sortByProperties` (optional)
    - `page` (optional, default `1`, min `1`)
    - `pageSize` (optional, default `10`, min `1`)
    - `showOnlyBlacklisted` (optional, default `false`)
- Response shape:
  - `200 OK` paged envelope:
    - `pagedList[]` items (`EmployeeViewModel`): `id`, `firstName`, `lastName`, `birthDay`, `jobTitle`, `phoneNumber`, `workingHours`, `blacklistEndDate`
    - `pageCount`, `itemCount`, `pageSize`
  - common errors:
    - `400 Bad Request` for model validation or validation exception (`{ errorCode, errorMessage }`)
    - `403 Forbidden` for missing `BasicPermissions.EmployeeList`
- Auth/tenant/org assumptions:
  - `[Authorize]` + permission requirement
  - organization is always read from current identity context
- Notes/risks:
  - response relies on `X.PagedList` serialization for `pagedList` metadata.

## 5) `GET /Wall/AllPosts`
- Migration priority: `P1`
- Purpose: primary cross-wall feed retrieval.
- Request shape:
  - headers: `Authorization: Bearer <token>`
  - query:
    - `filter` (`WallsListFilter`: `None|Followed|NotHiddenFromAllWalls|All|NotFollowed`)
    - `page` (optional, default `1`)
    - legacy alternative variant uses `wallsType` instead of `filter`
- Response shape:
  - `200 OK` (`PagedWallViewModel<WallPostViewModel>`)
    - `pagedList[]` post items with keys including `id`, `messageBody`, `created`, `author`, `comments[]`, `images[]`, `wallId`, `wallName`, `isLiked`, `isWatched`, `isHidden`, `lastActivity`
    - `pageSize`
  - common errors: `401 Unauthorized`, `403 Forbidden` (requires `BasicPermissions.Post`)
- Auth/tenant/org assumptions:
  - `[Authorize]` + permission-gated
  - tenant/org derived from authenticated user context
- Notes/risks:
  - two actions share route `/Wall/AllPosts`; migration should normalize on one contract.

## 6) `GET /Wall/Posts`
- Migration priority: `P1`
- Purpose: wall-specific paged feed retrieval.
- Request shape:
  - headers: `Authorization: Bearer <token>`
  - query:
    - `wallId` (required, must be `> 0`)
    - `page` (optional, default `1`)
- Response shape:
  - `200 OK` (`PagedWallViewModel<WallPostViewModel>`)
  - common errors:
    - `400 Bad Request` when `wallId <= 0` or validation exception (`{ errorCode, errorMessage }`)
    - `403 Forbidden` when user lacks post permission for non-event wall
    - `401 Unauthorized` when unauthenticated
- Auth/tenant/org assumptions:
  - `[Authorize]` + `PermissionAnyOfAuthorize(Post, Event)`
  - permission check also depends on wall type (`Events` special-case)
- Notes/risks:
  - authorization behavior is data-dependent (wall type), not static by endpoint alone.

## 7) `POST /Post/Create`
- Migration priority: `P1`
- Purpose: create a wall post (text/image/mentions).
- Request shape:
  - headers: `Authorization: Bearer <token>`
  - JSON body (`CreateWallPostViewModel`):
    - `wallId` (required, `>= 1`)
    - `messageBody` (optional, max length constrained)
    - `images` (optional, but validation requires message or image/picture)
    - `mentionedUserIds` (optional)
    - `pictureId` (optional)
- Response shape:
  - `200 OK` full created `WallPostViewModel`
  - common errors:
    - `400 Bad Request` model-state or validation payload (`{ errorCode, errorMessage }`)
    - `403 Forbidden` when posting to disallowed wall type
    - `401 Unauthorized`
- Auth/tenant/org assumptions:
  - `[Authorize]` + `PermissionAnyOfAuthorize(Post, Event)`
  - organization/user IDs are server-assigned from claims before service call
- Notes/risks:
  - side effects include async notifier dispatch; consumers may observe eventual consistency in notifications.

## 8) `POST /Comment/Create`
- Migration priority: `P1`
- Purpose: add a comment to an existing wall post.
- Request shape:
  - headers: `Authorization: Bearer <token>`
  - JSON body (`NewCommentViewModel`):
    - `postId` (required, min `1`)
    - `messageBody` (optional, max length constrained)
    - `images` (optional, but validation requires message or image/picture)
    - `mentionedUserIds` (optional)
    - `pictureId` (optional)
- Response shape:
  - `200 OK` `{ commentId }`
  - common errors:
    - `400 Bad Request` model-state or validation payload (`{ errorCode, errorMessage }`)
    - `403 Forbidden` when user lacks comment permission for non-event wall
    - `401 Unauthorized`
- Auth/tenant/org assumptions:
  - endpoint uses permission attribute, plus runtime wall-type permission checks
  - user/org context is injected from authenticated identity
- Notes/risks:
  - response is minimal; clients typically re-query post/comments for authoritative state.

## 9) `GET|POST /ApplicationUser/GetPaged`
- Migration priority: `P1`
- Purpose: paged administration user listing (search/sort/filter).
- Request shape:
  - headers: `Authorization: Bearer <token>`
  - accepts GET query or POST form/query parameters:
    - `page` (default `1`)
    - `pageSize` (default `10`)
    - `s` search string (default empty)
    - `sort` (default `LastName`)
    - `dir` sort direction (default empty)
    - `filter` JSON for `FilterDto[]` (`key`, `values[]`)
    - `includeProperties` (optional)
- Response shape:
  - `200 OK` (`PagedViewModel<AdministrationUserDto>`)
    - envelope: `pagedList[]`, `pageCount`, `itemCount`, `pageSize`
    - item core fields: `id`, `firstName`, `lastName`, `userName`, `jobTitle`, `isNewUser`, `hasRoom`, `projects[]`, `skills[]`
  - common errors: `401 Unauthorized`, `403 Forbidden` (missing `BasicPermissions.ApplicationUser`)
- Auth/tenant/org assumptions:
  - `[Authorize]` at controller + permission attribute
  - query is tenant-scoped through user/org context in services
- Notes/risks:
  - supports both GET and POST; contract should likely converge to one verb in modern API.

## 10) `GET /ApplicationUser/GetProfile` and `GET /ApplicationUser/GetUserProfile/{id}`
- Migration priority: `P2`
- Purpose: read full profile aggregate (self or explicit user).
- Request shape:
  - headers: `Authorization: Bearer <token>`
  - route/query:
    - self: `/ApplicationUser/GetProfile`
    - explicit: `/ApplicationUser/GetUserProfile/{id}`
- Response shape:
  - `200 OK` (`ApplicationUserProfileViewModel`) with sections:
    - `id`
    - `personalInfo` (`username`, `firstName`, `lastName`, `email`, `phoneNumber`, `birthDay`, `showBirthDay`, `bio`, `pictureId`)
    - `jobInfo` (`manager`, `projects[]`, `skills[]`, `qualificationLevel`, `certificates[]`, `exams[]`, `roles[]`, `employmentDate`, `workingHours`, `isAbsent`, `absentComment`)
    - `officeInfo` (`roomId`, `room`)
    - `shroomsInfo` (`dailyMailingHour`)
  - common errors:
    - `404 Not Found` when user does not exist
    - `401 Unauthorized` / `403 Forbidden` based on auth and permission checks on related profile sub-endpoints
- Auth/tenant/org assumptions:
  - `BasicPermissions.ApplicationUser` required
  - some nested/profile-part endpoints allow full access only to self or admin (`AdministrationPermissions.ApplicationUser`)
- Notes/risks:
  - profile visibility rules vary by sub-endpoint and caller role; modern contract should document privacy masking explicitly.

## Cross-cutting migration notes
- Many endpoints return either ASP.NET model-state errors or domain validation payload `{ errorCode, errorMessage }`; normalize this early in modern API.
- Legacy authz combines controller-level `[Authorize]`, permission attributes, and in-method checks (wall/event type, self-vs-admin checks).
- Tenant context is not an explicit request header in legacy controllers; it is injected from OWIN context (`tenantName`) and identity claims.
