import { FormEvent, useEffect, useMemo, useState } from "react";
import { legacyRuntimeStyles } from "../runtime/legacy-runtime-styles.js";
import { isPathActive } from "../runtime/runtime-shared.js";
import type {
  RuntimeData,
  RuntimeFormField,
  RuntimeFormModel,
  RuntimeTableModel
} from "./runtime-data";
import { FallbackView } from "../features/fallback/FallbackView";
import { AppShell } from "./layout/AppShell";
import { normalizeText } from "./lib/normalize-text";
import { useInteractiveTable } from "./hooks/useInteractiveTable";

declare global {
  interface Window {
    __SIMOONA_RUNTIME_DATA__?: RuntimeData;
  }
}

function renderActions(actions: unknown, className: string) {
  if (!Array.isArray(actions) || actions.length === 0) {
    return null;
  }

  return actions.map((action, index) => {
    const normalized = (action ?? {}) as {
      label?: string;
      path?: string;
      kind?: string;
    };
    const variantClass = normalized.kind === "danger" ? " is-danger" : "";

    if (normalized.path) {
      return (
        <a
          key={`action-link-${String(index)}`}
          className={`${className}${variantClass}`}
          href={normalized.path}
        >
          {normalized.label || "Action"}
        </a>
      );
    }

    return (
      <button
        key={`action-btn-${String(index)}`}
        className={`${className}${variantClass}`}
        type="button"
      >
        {normalized.label || "Action"}
      </button>
    );
  });
}

function WallFeedView({ runtimeData }: { runtimeData: RuntimeData }) {
  const wallFeed = (runtimeData.wallFeed as Record<string, unknown>) || null;
  if (!wallFeed) {
    return null;
  }

  const posts = Array.isArray(wallFeed.posts) ? wallFeed.posts : [];
  const rightSidebar = (wallFeed.rightSidebar || {}) as {
    quickActions?: Array<{ id: string; symbol: string; title: string }>;
    kudosFeed?: Array<{ score: string; fullName: string; reason: string; date: string }>;
    widgets?: Array<{ title: string; items: string[] }>;
  };

  const [likesByPostId, setLikesByPostId] = useState<Record<string, number>>(() => {
    const seed: Record<string, number> = {};
    for (const post of posts) {
      const normalized = post as { id?: string; likeCount?: number };
      if (normalized.id) {
        seed[normalized.id] = Number(normalized.likeCount || 0);
      }
    }
    return seed;
  });

  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});

  return (
    <div className="content-grid content-grid--wall">
      <section className="feed-column" data-ui="legacy-feed-column">
        {posts.map((post) => {
          const normalized = post as {
            id: string;
            wallName: string;
            author: string;
            timestamp: string;
            content: string;
            hashtags?: string;
            likeSummary?: string;
            replyCountLabel?: string;
            likeCount?: number;
            commentCount?: number;
            hasImage?: boolean;
          };
          const likeCount = likesByPostId[normalized.id] ?? Number(normalized.likeCount || 0);
          const replyVisible = Boolean(openReplies[normalized.id]);

          return (
            <article key={normalized.id} className="feed-card" data-post-id={normalized.id}>
              <header className="feed-card-topline">
                <span className="feed-wall-name">{normalized.wallName}</span>
                <span className="feed-header-icons">☆ ⌁</span>
              </header>
              <header className="feed-card-header">
                <div className="avatar" aria-hidden="true"></div>
                <div>
                  <p className="author">{normalized.author}</p>
                  <p className="meta">{normalized.timestamp}</p>
                </div>
              </header>
              <p className="content">{normalized.content}</p>
              {normalized.hasImage ? <div className="post-image" aria-hidden="true"></div> : null}
              <p className="hashtags">{normalized.hashtags || ""}</p>
              <div className="likes-summary">{normalized.likeSummary || ""}</div>
              <footer className="actions">
                <button
                  type="button"
                  className="action-link action-like"
                  data-like-for={normalized.id}
                  onClick={() => {
                    setLikesByPostId((current) => ({
                      ...current,
                      [normalized.id]: (current[normalized.id] ?? likeCount) + 1
                    }));
                  }}
                >
                  Unlike
                </button>
                <button
                  type="button"
                  className="action-link action-reply"
                  data-reply-for={normalized.id}
                  onClick={() => {
                    setOpenReplies((current) => ({
                      ...current,
                      [normalized.id]: !current[normalized.id]
                    }));
                  }}
                >
                  Reply
                </button>
              </footer>
              <form className="reply-form" data-reply-form={normalized.id} hidden={!replyVisible}>
                <input
                  type="text"
                  placeholder="Add comment"
                  aria-label={`Comment for ${normalized.id}`}
                />
              </form>
              <div className="reply-toggle">{normalized.replyCountLabel || ""}</div>
              <div className="feed-counter-row">
                <span data-like-count={normalized.id}>{likeCount}</span> likes
                <span className="separator-dot">•</span>
                <span>{normalized.commentCount ?? 0}</span> replies
              </div>
            </article>
          );
        })}
      </section>
      <aside className="right-rail" data-ui="legacy-right-rail">
        <section className="quick-actions">
          {(rightSidebar.quickActions || []).map((action) => (
            <button key={action.id} type="button" className="quick-action" title={action.title}>
              {action.symbol}
            </button>
          ))}
        </section>
        <section className="kudos-stream">
          <ul>
            {(rightSidebar.kudosFeed || []).map((entry, index) => (
              <li key={`kudos-${String(index)}`} className="kudos-item">
                <div className="kudos-score">{entry.score}</div>
                <div className="kudos-text">
                  <strong>{entry.fullName}</strong>
                  <p>{entry.reason}</p>
                  <span>{entry.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {(rightSidebar.widgets || []).map((widget) => (
          <section key={widget.title} className="widget-card">
            <h3>{widget.title}</h3>
            <ul>
              {(widget.items || []).map((item) => (
                <li key={`${widget.title}-${item}`}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </aside>
    </div>
  );
}

function EmployeeListView({ runtimeData }: { runtimeData: RuntimeData }) {
  const employeeList = (runtimeData.employeeList as
    | {
        title?: string;
        pageSize?: number;
        rows?: Array<Record<string, unknown>>;
      }
    | undefined) || { rows: [] };

  const table = useInteractiveTable({
    table: {
      columns: [
        { key: "fullName", label: "First name Last name", sortable: true },
        { key: "birthDate", label: "Birth date", sortable: true },
        { key: "jobTitle", label: "Job title", sortable: true },
        { key: "workingHours", label: "Working hours", sortable: true }
      ],
      rows: employeeList.rows || [],
      pageSize: employeeList.pageSize || 10,
      defaultSort: { key: "fullName", direction: "asc" }
    }
  });

  const [selectedId, setSelectedId] = useState<string>(
    String((employeeList.rows || [])[0]?.id || "")
  );

  return (
    <section className="employee-panel" data-ui="legacy-employee-list">
      <h1>{employeeList.title || "Employee List"}</h1>
      <div className="employee-toolbar">
        <input
          id="employee-filter"
          type="search"
          placeholder="Type to filter list..."
          aria-label="Filter employees"
          value={table.search}
          onChange={(event) => {
            table.setSearch(event.target.value);
            table.setPage(1);
          }}
        />
      </div>
      <table className="employee-table">
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th key={column.key}>
                <button
                  className="sort-link"
                  data-sort-key={column.key}
                  type="button"
                  onClick={() => {
                    table.handleSort(column.key);
                    table.setPage(1);
                  }}
                >
                  {column.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody id="employee-rows">
          {table.pagedRows.map((row) => {
            const normalized = row as Record<string, unknown>;
            const rowId = String(normalized.id || "");
            const rowClass = rowId === selectedId ? "employee-row-selected" : "";
            return (
              <tr
                key={rowId}
                className={rowClass}
                data-row-id={rowId}
                onClick={() => {
                  setSelectedId(rowId);
                }}
              >
                <td>
                  <a className="employee-name" href={`/default/Profiles/Details/${rowId}`}>
                    {String(normalized.fullName || "")}
                  </a>
                </td>
                <td>{String(normalized.birthDate || "")}</td>
                <td>{String(normalized.jobTitle || "")}</td>
                <td>{String(normalized.workingHours || "")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <nav className="employee-pagination" id="employee-pagination" aria-label="Employee list pages">
        <button
          type="button"
          className="pager-btn"
          data-page-nav="first"
          disabled={table.currentPage <= 1}
          onClick={() => table.setPage(1)}
        >
          «
        </button>
        <button
          type="button"
          className="pager-btn"
          data-page-nav="prev"
          disabled={table.currentPage <= 1}
          onClick={() => table.setPage(Math.max(1, table.currentPage - 1))}
        >
          ‹
        </button>
        {Array.from({ length: table.totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={`page-${String(pageNumber)}`}
            type="button"
            className={`pager-btn${pageNumber === table.currentPage ? " is-current" : ""}`}
            data-page={String(pageNumber)}
            onClick={() => table.setPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          className="pager-btn"
          data-page-nav="next"
          disabled={table.currentPage >= table.totalPages}
          onClick={() => table.setPage(Math.min(table.totalPages, table.currentPage + 1))}
        >
          ›
        </button>
        <button
          type="button"
          className="pager-btn"
          data-page-nav="last"
          disabled={table.currentPage >= table.totalPages}
          onClick={() => table.setPage(table.totalPages)}
        >
          »
        </button>
      </nav>
    </section>
  );
}

function ProfileView({ runtimeData }: { runtimeData: RuntimeData }) {
  const profilePage = runtimeData.profilePage as
    | {
        mode?: string;
        profileId?: string;
        details?: Record<string, unknown>;
        edit?: {
          activeTab?: string;
          tabs?: Array<{ id: string; label: string }>;
          personal?: Record<string, string>;
          job?: Record<string, unknown>;
          office?: Record<string, unknown>;
          blacklist?: Record<string, unknown>;
        };
      }
    | undefined;

  if (!profilePage) {
    return null;
  }

  if (profilePage.mode === "edit") {
    const tabs = profilePage.edit?.tabs || [];
    const [activeTab, setActiveTab] = useState(profilePage.edit?.activeTab || "personal");
    const [firstName, setFirstName] = useState(String(profilePage.edit?.personal?.firstName || ""));
    const [dirty, setDirty] = useState(false);
    const [feedbackVisible, setFeedbackVisible] = useState(false);

    return (
      <section className="profile-edit-panel" data-ui="legacy-profile-edit">
        <h1>Profiles</h1>
        <h4 className="profile-warning">User waiting for confirmation</h4>
        <div className="profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`profile-tab-btn${tab.id === activeTab ? " is-active" : ""}`}
              data-profile-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          id="profile-edit-form"
          className="profile-form"
          onSubmit={(event) => {
            event.preventDefault();
            setDirty(false);
            setFeedbackVisible(true);
          }}
        >
          <div data-profile-tab-content="personal" className="profile-tab-content" hidden={activeTab !== "personal"}>
            <div className="profile-grid">
              <label>
                First name
                <input
                  id="profile-personal-firstname"
                  type="text"
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                />
              </label>
              <label>
                Last name
                <input
                  id="profile-personal-lastname"
                  type="text"
                  defaultValue={String(profilePage.edit?.personal?.lastName || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                />
              </label>
              <label>
                Email
                <input
                  id="profile-personal-email"
                  type="email"
                  defaultValue={String(profilePage.edit?.personal?.email || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                />
              </label>
              <label>
                Phone number
                <input
                  id="profile-personal-phone"
                  type="text"
                  defaultValue={String(profilePage.edit?.personal?.phoneNumber || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                />
              </label>
              <label>
                Birthday
                <input
                  id="profile-personal-birthday"
                  type="date"
                  defaultValue={String(profilePage.edit?.personal?.birthday || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                />
              </label>
              <label>
                Bio
                <textarea
                  id="profile-personal-bio"
                  defaultValue={String(profilePage.edit?.personal?.bio || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                ></textarea>
              </label>
            </div>
          </div>

          <div data-profile-tab-content="job" className="profile-tab-content" hidden={activeTab !== "job"}>
            <div className="profile-grid">
              <label>
                Manager
                <input
                  type="text"
                  defaultValue={String(profilePage.edit?.job?.manager || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                />
              </label>
              <label>
                Job title
                <input
                  type="text"
                  defaultValue={String(profilePage.edit?.job?.jobTitle || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                />
              </label>
            </div>
          </div>

          <div data-profile-tab-content="office" className="profile-tab-content" hidden={activeTab !== "office"}>
            <div className="profile-grid">
              <label>
                Office
                <input
                  type="text"
                  defaultValue={String(profilePage.edit?.office?.office || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                />
              </label>
              <label>
                Floor
                <input
                  type="text"
                  defaultValue={String(profilePage.edit?.office?.floor || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                />
              </label>
            </div>
          </div>

          <div
            data-profile-tab-content="blacklist"
            className="profile-tab-content"
            hidden={activeTab !== "blacklist"}
          >
            <div className="profile-grid">
              <label>
                Blacklist end date
                <input
                  type="date"
                  defaultValue={String(profilePage.edit?.blacklist?.endDate || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                />
              </label>
              <label>
                Reason
                <textarea
                  defaultValue={String(profilePage.edit?.blacklist?.reason || "")}
                  onChange={() => {
                    setDirty(true);
                    setFeedbackVisible(false);
                  }}
                ></textarea>
              </label>
            </div>
          </div>

          <div className="profile-actions">
            <button id="profile-edit-save" type="submit" className="btn-primary" disabled={!dirty}>
              Save
            </button>
            <a className="btn-secondary" href={`/default/Profiles/${String(profilePage.profileId || "1")}`}>
              Back to profile
            </a>
          </div>
          <div id="profile-edit-feedback" className="profile-feedback" hidden={!feedbackVisible}>
            Information saved.
          </div>
        </form>
      </section>
    );
  }

  const details = profilePage.details || {};

  return (
    <section className="profile-details-panel" data-ui="legacy-profile-details">
      <h1>Profiles</h1>
      <article className="profile-card">
        <header className="profile-card-header">
          <div className="profile-avatar" aria-hidden="true"></div>
          <div>
            <a className="profile-display-name" href={`/default/Office?user=${String(details.username || "")}`}>
              {String(details.displayName || "User")}
            </a>
            <p className="profile-job-line">
              {String(details.jobTitle || "")}
              {details.qualificationLevel
                ? ` (${String(details.qualificationLevel || "")})`
                : ""}
            </p>
          </div>
        </header>
        <div className="profile-main-grid">
          <div className="profile-row">
            <span>Email</span>
            <a href={`mailto:${String(details.email || "")}`}>{String(details.email || "")}</a>
          </div>
          <div className="profile-row">
            <span>Phone number</span>
            <strong>{String(details.phoneNumber || "")}</strong>
          </div>
          <div className="profile-row">
            <span>Working hours</span>
            <strong>{String(details.workingHours || "")}</strong>
          </div>
        </div>
        <div className="profile-actions">
          <a className="btn-primary" href={`/default/Profiles/${String(profilePage.profileId || "1")}/Edit/personal`}>
            Edit
          </a>
        </div>
      </article>
    </section>
  );
}

function SettingsView({ runtimeData }: { runtimeData: RuntimeData }) {
  const settingsPage = runtimeData.settingsPage as
    | {
        tabs?: Array<{ id: string; label: string }>;
        activeTab?: string;
        general?: {
          languageCode?: string;
          timeZoneId?: string;
          languages?: Array<{ code: string; label: string }>;
          timeZones?: Array<{ id: string; label: string }>;
        };
        notifications?: {
          walls?: Array<{ id: string; name: string; isMainWall: boolean; app: boolean; email: boolean }>;
          eventsApp?: boolean;
          eventsEmail?: boolean;
          projectsApp?: boolean;
          projectsEmail?: boolean;
        };
        providers?: {
          items?: Array<{ name: string; linked: boolean; email: string | null; canUnlink: boolean }>;
        };
      }
    | undefined;

  if (!settingsPage) {
    return null;
  }

  const [activeTab, setActiveTab] = useState(settingsPage.activeTab || "general");

  const [language, setLanguage] = useState(String(settingsPage.general?.languageCode || "en"));
  const [timezone, setTimezone] = useState(String(settingsPage.general?.timeZoneId || "Europe/Vilnius"));
  const [initialGeneral, setInitialGeneral] = useState({
    language: String(settingsPage.general?.languageCode || "en"),
    timezone: String(settingsPage.general?.timeZoneId || "Europe/Vilnius")
  });
  const [generalFeedbackVisible, setGeneralFeedbackVisible] = useState(false);

  const [notificationState, setNotificationState] = useState(() => {
    const walls = settingsPage.notifications?.walls || [];
    return {
      walls: walls.map((wall) => ({ ...wall })),
      eventsApp: Boolean(settingsPage.notifications?.eventsApp),
      eventsEmail: Boolean(settingsPage.notifications?.eventsEmail),
      projectsApp: Boolean(settingsPage.notifications?.projectsApp),
      projectsEmail: Boolean(settingsPage.notifications?.projectsEmail)
    };
  });
  const [notificationsDirty, setNotificationsDirty] = useState(false);

  const [providers, setProviders] = useState(
    (settingsPage.providers?.items || []).map((provider) => ({ ...provider }))
  );

  const generalDirty = language !== initialGeneral.language || timezone !== initialGeneral.timezone;

  return (
    <section className="settings-panel" data-ui="legacy-settings">
      <article className="settings-card">
        <header className="settings-title">Settings</header>
        <nav className="settings-tabs">
          {(settingsPage.tabs || []).map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`settings-tab-btn${tab.id === activeTab ? " is-active" : ""}`}
              data-settings-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="settings-content">
          <div data-settings-content="general" hidden={activeTab !== "general"}>
            <form
              className="settings-form"
              id="settings-general-form"
              onSubmit={(event) => {
                event.preventDefault();
                setInitialGeneral({ language, timezone });
                setGeneralFeedbackVisible(true);
              }}
            >
              <label>
                Language
                <select
                  id="settings-language"
                  value={language}
                  onChange={(event) => {
                    setLanguage(event.target.value);
                    setGeneralFeedbackVisible(false);
                  }}
                >
                  {(settingsPage.general?.languages || []).map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Time zone
                <select
                  id="settings-timezone"
                  value={timezone}
                  onChange={(event) => {
                    setTimezone(event.target.value);
                    setGeneralFeedbackVisible(false);
                  }}
                >
                  {(settingsPage.general?.timeZones || []).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="settings-actions">
                <button id="settings-general-save" type="submit" className="btn-primary" disabled={!generalDirty}>
                  Save
                </button>
                <a className="btn-secondary" href="/default/Wall/Feed">
                  Cancel
                </a>
              </div>
              <div id="settings-general-feedback" className="profile-feedback" hidden={!generalFeedbackVisible}>
                Information saved.
              </div>
            </form>
          </div>

          <div data-settings-content="notifications" hidden={activeTab !== "notifications"}>
            <form
              id="settings-notifications-form"
              onSubmit={(event) => {
                event.preventDefault();
                setNotificationsDirty(false);
              }}
            >
              <table className="settings-table">
                <thead>
                  <tr>
                    <th>Wall</th>
                    <th>App</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationState.walls.map((wall) => (
                    <tr key={wall.id}>
                      <td>
                        {wall.name}
                        {wall.isMainWall ? " ⚠" : ""}
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          data-settings-checkbox
                          checked={wall.app}
                          disabled={wall.isMainWall}
                          onChange={(event) => {
                            setNotificationsDirty(true);
                            setNotificationState((current) => ({
                              ...current,
                              walls: current.walls.map((item) =>
                                item.id === wall.id ? { ...item, app: event.target.checked } : item
                              )
                            }));
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          data-settings-checkbox
                          checked={wall.email}
                          disabled={wall.isMainWall}
                          onChange={(event) => {
                            setNotificationsDirty(true);
                            setNotificationState((current) => ({
                              ...current,
                              walls: current.walls.map((item) =>
                                item.id === wall.id ? { ...item, email: event.target.checked } : item
                              )
                            }));
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>Events</td>
                    <td>
                      <input
                        type="checkbox"
                        data-settings-checkbox
                        checked={notificationState.eventsApp}
                        onChange={(event) => {
                          setNotificationsDirty(true);
                          setNotificationState((current) => ({
                            ...current,
                            eventsApp: event.target.checked
                          }));
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        data-settings-checkbox
                        checked={notificationState.eventsEmail}
                        onChange={(event) => {
                          setNotificationsDirty(true);
                          setNotificationState((current) => ({
                            ...current,
                            eventsEmail: event.target.checked
                          }));
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Projects</td>
                    <td>
                      <input
                        type="checkbox"
                        data-settings-checkbox
                        checked={notificationState.projectsApp}
                        onChange={(event) => {
                          setNotificationsDirty(true);
                          setNotificationState((current) => ({
                            ...current,
                            projectsApp: event.target.checked
                          }));
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        data-settings-checkbox
                        checked={notificationState.projectsEmail}
                        onChange={(event) => {
                          setNotificationsDirty(true);
                          setNotificationState((current) => ({
                            ...current,
                            projectsEmail: event.target.checked
                          }));
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="settings-actions">
                <button
                  id="settings-notifications-save"
                  type="submit"
                  className="btn-primary"
                  disabled={!notificationsDirty}
                >
                  Save
                </button>
                <a className="btn-secondary" href="/default/Wall/Feed">
                  Cancel
                </a>
              </div>
            </form>
          </div>

          <div data-settings-content="providers" hidden={activeTab !== "providers"}>
            <table className="settings-table" id="settings-providers-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <tr key={provider.name} data-provider-name={provider.name}>
                    <td>{provider.name}</td>
                    <td>
                      {provider.linked ? (
                        provider.email || "Linked"
                      ) : (
                        <button
                          type="button"
                          className="provider-link-btn"
                          data-provider-link={provider.name}
                        >
                          Sign in
                        </button>
                      )}
                    </td>
                    <td>
                      {provider.linked && provider.canUnlink ? (
                        <button
                          type="button"
                          className="provider-unlink-btn"
                          data-provider-unlink={provider.name}
                          onClick={() => {
                            setProviders((current) =>
                              current.map((item) =>
                                item.name === provider.name
                                  ? {
                                      ...item,
                                      linked: false,
                                      canUnlink: false,
                                      email: null
                                    }
                                  : item
                              )
                            );
                          }}
                        >
                          Remove
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </section>
  );
}

function AuthField({
  field,
  value,
  onChange
}: {
  field: RuntimeFormField;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `auth-input-${field.id}`;
  const inputType = field.type || "text";

  if (inputType === "textarea") {
    return (
      <label className="auth-field" htmlFor={id}>
        <span>{field.label}</span>
        <textarea id={id} name={field.id} value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    );
  }

  return (
    <label className="auth-field" htmlFor={id}>
      <span>{field.label}</span>
      <input
        id={id}
        name={field.id}
        type={inputType}
        placeholder={field.placeholder || ""}
        value={value}
        data-auth-field
        data-auth-required={field.required ? "true" : "false"}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function AuthUtilityView({ runtimeData }: { runtimeData: RuntimeData }) {
  const authPage = runtimeData.authUtilityPage as
    | {
        view?: string;
        title?: string;
        subtitle?: string;
        organizationName?: string;
        message?: string;
        alert?: { kind?: string; message?: string };
        providers?: Array<{ id: string; label: string }>;
        links?: Array<{ label: string; path: string; kind?: string }>;
        form?: {
          id?: string;
          submitLabel?: string;
          submitSuccessMessage?: string;
          fields?: RuntimeFormField[];
        };
      }
    | undefined;

  if (!authPage) {
    return null;
  }

  const formFields = authPage.form?.fields || [];
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of formFields) {
      initial[field.id] = field.value || "";
    }
    return initial;
  });
  const [formFeedback, setFormFeedback] = useState<string>("");
  const [providerFeedback, setProviderFeedback] = useState<string>("");

  const formId = authPage.form?.id || "auth-form";

  const submitEnabled = useMemo(() => {
    if (!formFields.length) {
      return false;
    }

    const requiredValid = formFields.every((field) => {
      if (!field.required) {
        return true;
      }
      return normalizeText(values[field.id]).length > 0;
    });

    const passwordValue = values.password;
    const confirmValue = values.confirmPassword || values.repeatedPassword;
    const passwordsMatch =
      !passwordValue || !confirmValue || normalizeText(passwordValue) === normalizeText(confirmValue);

    return requiredValid && passwordsMatch;
  }, [formFields, values]);

  const alertClass =
    authPage.alert?.kind === "success"
      ? " auth-alert--success"
      : authPage.alert?.kind === "danger"
        ? " auth-alert--danger"
        : "";

  return (
    <section
      className="auth-panel"
      data-ui="legacy-auth-view"
      data-auth-view={authPage.view || "auth"}
    >
      <article className="auth-card">
        <header className="auth-header">
          <h1>{authPage.title || "Simoona"}</h1>
          {authPage.subtitle ? <p>{authPage.subtitle}</p> : null}
        </header>

        {authPage.organizationName ? <p className="auth-org-name">{authPage.organizationName}</p> : null}
        {authPage.message ? <p className="auth-system-message">{authPage.message}</p> : null}
        {authPage.alert?.message ? <div className={`auth-alert${alertClass}`}>{authPage.alert.message}</div> : null}

        {authPage.form && formFields.length ? (
          <form
            id={formId}
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!submitEnabled) {
                return;
              }
              setFormFeedback(authPage.form?.submitSuccessMessage || "Completed successfully.");
            }}
          >
            {formFields.map((field) => (
              <AuthField
                key={field.id}
                field={field}
                value={values[field.id] || ""}
                onChange={(nextValue) => {
                  setValues((current) => ({
                    ...current,
                    [field.id]: nextValue
                  }));
                  setFormFeedback("");
                }}
              />
            ))}

            <button
              id={`${formId}-submit`}
              className="btn-primary auth-submit-btn"
              type="submit"
              disabled={!submitEnabled}
            >
              {authPage.form.submitLabel || "Submit"}
            </button>
            <div id={`${formId}-feedback`} className="auth-feedback" hidden={!formFeedback}>
              {formFeedback}
            </div>
          </form>
        ) : null}

        {Array.isArray(authPage.providers) && authPage.providers.length ? (
          <>
            <div className="auth-provider-grid">
              {authPage.providers.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  className="auth-provider-btn"
                  data-auth-provider={provider.id}
                  onClick={() => {
                    setProviderFeedback(`${provider.id} sign-in flow started.`);
                  }}
                >
                  {provider.label}
                </button>
              ))}
            </div>
            <div id="auth-provider-feedback" className="auth-feedback" hidden={!providerFeedback}>
              {providerFeedback}
            </div>
          </>
        ) : null}

        {Array.isArray(authPage.links) && authPage.links.length ? (
          <div className="auth-link-row">
            {authPage.links.map((link) => (
              <a
                key={`${link.label}-${link.path}`}
                className={link.kind === "primary" ? "btn-primary" : "btn-secondary"}
                href={link.path}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </article>
    </section>
  );
}

function ClientFeatureView({ runtimeData }: { runtimeData: RuntimeData }) {
  const clientPage = runtimeData.clientFeaturePage as
    | {
        view?: string;
        title?: string;
        subtitle?: string;
        navigation?: Array<{ id: string; label: string; path: string }>;
        cards?: Array<{ title: string; subtitle: string }>;
        details?: { sections?: Array<{ label: string; value: string }> };
        filterPlaceholder?: string;
        table?: RuntimeTableModel;
        form?: RuntimeFormModel;
      }
    | undefined;

  if (!clientPage) {
    return null;
  }

  const table = clientPage.table
    ? useInteractiveTable({
        table: clientPage.table
      })
    : null;

  const form = clientPage.form;
  const formFields: RuntimeFormField[] = Array.isArray(form?.fields) ? form.fields : [];
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of formFields) {
      initial[field.id] = field.value || "";
    }
    return initial;
  });
  const [formFeedbackVisible, setFormFeedbackVisible] = useState(false);

  const formId = form?.id || "client-form";

  const canSubmitForm = useMemo(() => {
    if (!form || !formFields.length) {
      return false;
    }

    return formFields.every((field) => {
      if (!field.required) {
        return true;
      }

      return normalizeText(formValues[field.id]).length > 0;
    });
  }, [form, formFields, formValues]);

  return (
    <section
      className="client-feature-panel"
      data-ui="legacy-client-feature"
      data-client-view={clientPage.view || "unknown"}
    >
      <header className="client-feature-header">
        <h1>{clientPage.title || "Feature"}</h1>
        {clientPage.subtitle ? <p>{clientPage.subtitle}</p> : null}
      </header>

      <nav className="client-nav">
        {(clientPage.navigation || []).map((item) => (
          <a
            key={item.id}
            className={`client-nav-link${isPathActive(item.path, runtimeData.route) ? " is-active" : ""}`}
            href={item.path}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {Array.isArray(clientPage.cards) && clientPage.cards.length ? (
        <section className="client-card-grid">
          {clientPage.cards.map((card, index) => (
            <article key={`card-${String(index)}`} className="client-card-item">
              <strong>{card.title}</strong>
              <p>{card.subtitle}</p>
            </article>
          ))}
        </section>
      ) : null}

      {Array.isArray(clientPage.details?.sections) && clientPage.details?.sections.length ? (
        <section className="client-details">
          {clientPage.details.sections.map((item) => (
            <div key={`${item.label}-${item.value}`} className="client-details-row">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </section>
      ) : null}

      {table ? (
        <>
          {clientPage.filterPlaceholder ? (
            <div className="client-toolbar">
              <input
                id="client-list-filter"
                type="search"
                placeholder={clientPage.filterPlaceholder}
                aria-label="Client feature filter"
                value={table.search}
                onChange={(event) => {
                  table.setSearch(event.target.value);
                  table.setPage(1);
                }}
              />
            </div>
          ) : null}
          <table className="client-table">
            <thead>
              <tr>
                {table.columns.map((column) => (
                  <th key={column.key}>
                    {column.sortable ? (
                      <button
                        className="client-sort-link"
                        type="button"
                        data-client-sort-key={column.key}
                        onClick={() => {
                          table.handleSort(column.key);
                          table.setPage(1);
                        }}
                      >
                        {column.label}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="client-list-rows">
              {table.pagedRows.map((row) => {
                const normalized = row as Record<string, unknown>;
                return (
                  <tr key={String(normalized.id || Math.random())} data-client-row-id={String(normalized.id || "")}> 
                    {table.columns.map((column) => {
                      if (column.key === "actions") {
                        return (
                          <td key={column.key}>
                            <div className="client-table-actions-cell">
                              {renderActions(normalized.actions, "admin-table-action")}
                            </div>
                          </td>
                        );
                      }

                      if (column.link) {
                        const pathValue = String(normalized[`${column.key}Path`] || "");
                        if (pathValue) {
                          return (
                            <td key={column.key}>
                              <a className="admin-cell-link" href={pathValue}>
                                {String(normalized[column.key] || "")}
                              </a>
                            </td>
                          );
                        }
                      }

                      if (column.badge) {
                        const value = String(normalized[column.key] || "");
                        const normalizedBadge = normalizeText(value);
                        const positiveTokens = ["open", "active", "approved", "available", "yes", "in progress", "started"];
                        const negativeTokens = ["full", "on hold", "ended", "pending", "no", "closed"];
                        const badgeClass = positiveTokens.includes(normalizedBadge)
                          ? " is-positive"
                          : negativeTokens.includes(normalizedBadge)
                            ? " is-negative"
                            : "";

                        return (
                          <td key={column.key}>
                            <span className={`client-status-badge${badgeClass}`}>{value}</span>
                          </td>
                        );
                      }

                      return <td key={column.key}>{String(normalized[column.key] || "")}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <nav className="employee-pagination" id="client-list-pagination" aria-label="Client list pages">
            <button
              type="button"
              className="pager-btn"
              data-client-page-nav="first"
              disabled={table.currentPage <= 1}
              onClick={() => table.setPage(1)}
            >
              «
            </button>
            <button
              type="button"
              className="pager-btn"
              data-client-page-nav="prev"
              disabled={table.currentPage <= 1}
              onClick={() => table.setPage(Math.max(1, table.currentPage - 1))}
            >
              ‹
            </button>
            {Array.from({ length: table.totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={`client-page-${String(pageNumber)}`}
                type="button"
                className={`pager-btn${pageNumber === table.currentPage ? " is-current" : ""}`}
                data-client-page={String(pageNumber)}
                onClick={() => table.setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              className="pager-btn"
              data-client-page-nav="next"
              disabled={table.currentPage >= table.totalPages}
              onClick={() => table.setPage(Math.min(table.totalPages, table.currentPage + 1))}
            >
              ›
            </button>
            <button
              type="button"
              className="pager-btn"
              data-client-page-nav="last"
              disabled={table.currentPage >= table.totalPages}
              onClick={() => table.setPage(table.totalPages)}
            >
              »
            </button>
          </nav>
        </>
      ) : null}

      {form ? (
        <form
          id={formId}
          className="client-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canSubmitForm) {
              return;
            }
            setFormFeedbackVisible(true);
          }}
        >
          {formFields.map((field) => {
            const value = formValues[field.id] || "";

            if (field.type === "textarea") {
              return (
                <label key={field.id} className="client-form-field">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-danger">*</span> : null}
                  </span>
                  <textarea
                    id={field.id}
                    value={value}
                    onChange={(event) => {
                      setFormValues((current) => ({ ...current, [field.id]: event.target.value }));
                      setFormFeedbackVisible(false);
                    }}
                  ></textarea>
                </label>
              );
            }

            if (field.type === "select") {
              return (
                <label key={field.id} className="client-form-field">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-danger">*</span> : null}
                  </span>
                  <select
                    id={field.id}
                    value={value}
                    onChange={(event) => {
                      setFormValues((current) => ({ ...current, [field.id]: event.target.value }));
                      setFormFeedbackVisible(false);
                    }}
                  >
                    {(field.options || []).map((option: { value: string; label: string }) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label key={field.id} className="client-form-field">
                <span>
                  {field.label}
                  {field.required ? <span className="text-danger">*</span> : null}
                </span>
                <input
                  id={field.id}
                  type={field.type || "text"}
                  value={value}
                  onChange={(event) => {
                    setFormValues((current) => ({ ...current, [field.id]: event.target.value }));
                    setFormFeedbackVisible(false);
                  }}
                />
              </label>
            );
          })}

          <div className="client-form-actions">
            <button id={`${formId}-save`} type="submit" className="btn-primary" disabled={!canSubmitForm}>
              {form.saveLabel || "Save"}
            </button>
            {form.cancelPath ? (
              <a className="btn-secondary" href={form.cancelPath}>
                Cancel
              </a>
            ) : null}
          </div>
          <div id={`${formId}-feedback`} className="profile-feedback" hidden={!formFeedbackVisible}>
            Information saved.
          </div>
        </form>
      ) : null}
    </section>
  );
}

function AdminView({ runtimeData }: { runtimeData: RuntimeData }) {
  const adminPage = runtimeData.adminPage as
    | {
        view?: string;
        title?: string;
        subtitle?: string;
        navigation?: Array<{ id: string; label: string; path: string }>;
        breadcrumbs?: Array<{ label: string; path?: string }>;
        cards?: Array<{ id: string; title: string; subtitle: string; path: string; icon?: string }>;
        filterPlaceholder?: string;
        primaryAction?: { label: string; path?: string; id?: string };
        table?: RuntimeTableModel;
        form?: RuntimeFormModel;
        donationsTable?: { columns?: Array<{ label: string }>; rows?: Array<Record<string, string>> };
        refund?: { message?: string; failedMessage?: string; actionLabel?: string; cancelPath?: string };
      }
    | undefined;

  if (!adminPage) {
    return null;
  }

  const table = adminPage.table
    ? useInteractiveTable({
        table: adminPage.table
      })
    : null;

  const form = adminPage.form;
  const formFields: RuntimeFormField[] = Array.isArray(form?.fields) ? form.fields : [];
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of formFields) {
      initial[field.id] = field.value || "";
    }
    return initial;
  });
  const [formInitialValues] = useState(formValues);
  const [formFeedback, setFormFeedback] = useState<string>("");

  const [refundMessage, setRefundMessage] = useState(String(adminPage.refund?.message || ""));

  const formDirty = useMemo(() => {
    return Object.keys(formValues).some((key) => formValues[key] !== formInitialValues[key]);
  }, [formInitialValues, formValues]);

  const requiredFieldsValid = useMemo(() => {
    if (!form || !formFields.length) {
      return false;
    }

    return formFields.every((field) => {
      if (!field.required) {
        return true;
      }
      return normalizeText(formValues[field.id]).length > 0;
    });
  }, [form, formFields, formValues]);

  const formSaveEnabled = Boolean(form && formDirty && requiredFieldsValid);

  return (
    <section className="admin-panel" data-ui="legacy-admin-page" data-admin-view={adminPage.view || "unknown"}>
      <header className="admin-header">
        <h1>{adminPage.title || "Administration"}</h1>
        {adminPage.subtitle ? <p className="admin-subtitle">{adminPage.subtitle}</p> : null}
        <div className="admin-breadcrumbs">
          {(adminPage.breadcrumbs || []).map((item, index) => (
            <span key={`crumb-${String(index)}`}>
              {item.path ? <a href={item.path}>{item.label}</a> : <span>{item.label}</span>}
              {index < (adminPage.breadcrumbs || []).length - 1 ? (
                <span className="admin-breadcrumb-sep">→</span>
              ) : null}
            </span>
          ))}
        </div>
      </header>

      <nav className="admin-nav">
        {(adminPage.navigation || []).map((item) => (
          <a
            key={item.id}
            className={`admin-nav-link${isPathActive(item.path, runtimeData.route) ? " is-active" : ""}`}
            href={item.path}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {Array.isArray(adminPage.cards) && adminPage.cards.length ? (
        <section className="admin-card-grid">
          {adminPage.cards.map((card) => (
            <a key={card.id} className="admin-card-link" href={card.path || "#"}>
              <span className="admin-card-icon" aria-hidden="true">
                {card.icon || "+"}
              </span>
              <strong>{card.title}</strong>
              <p>{card.subtitle}</p>
            </a>
          ))}
        </section>
      ) : null}

      {table ? (
        <>
          {adminPage.filterPlaceholder ? (
            <div className="admin-toolbar">
              <input
                id="admin-list-filter"
                type="search"
                placeholder={adminPage.filterPlaceholder}
                aria-label="Admin filter"
                value={table.search}
                onChange={(event) => {
                  table.setSearch(event.target.value);
                  table.setPage(1);
                }}
              />
            </div>
          ) : null}

          <div className="admin-table-actions">
            {adminPage.primaryAction ? (
              adminPage.primaryAction.path ? (
                <a className="btn-primary" href={adminPage.primaryAction.path}>
                  {adminPage.primaryAction.label || "Action"}
                </a>
              ) : (
                <button className="btn-primary" type="button" id={adminPage.primaryAction.id || "admin-primary-action"}>
                  {adminPage.primaryAction.label || "Action"}
                </button>
              )
            ) : null}
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                {table.columns.map((column) => (
                  <th key={column.key}>
                    {column.sortable ? (
                      <button
                        className="admin-sort-link"
                        type="button"
                        data-admin-sort-key={column.key}
                        onClick={() => {
                          table.handleSort(column.key);
                          table.setPage(1);
                        }}
                      >
                        {column.label}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="admin-list-rows">
              {table.pagedRows.map((row) => {
                const normalized = row as Record<string, unknown>;
                return (
                  <tr key={String(normalized.id || Math.random())} data-admin-row-id={String(normalized.id || "")}> 
                    {table.columns.map((column) => {
                      if (column.key === "actions") {
                        return (
                          <td key={column.key}>
                            <div className="admin-table-actions-cell">
                              {renderActions(normalized.actions, "admin-table-action")}
                            </div>
                          </td>
                        );
                      }

                      if (column.colorSwatch) {
                        return (
                          <td key={column.key}>
                            <span
                              className="admin-color-swatch"
                              style={{ background: String(normalized[column.key] || "#ffffff") }}
                            ></span>
                            <span>{String(normalized[column.key] || "")}</span>
                          </td>
                        );
                      }

                      if (column.badge) {
                        const value = String(normalized[column.key] || "");
                        const token = normalizeText(value);
                        const badgeClass = token === "yes" ? " is-yes" : token === "no" ? " is-no" : "";
                        return (
                          <td key={column.key}>
                            <span className={`admin-status-badge${badgeClass}`}>{value}</span>
                          </td>
                        );
                      }

                      if (column.link) {
                        const pathValue = String(normalized[`${column.key}Path`] || "");
                        if (pathValue) {
                          return (
                            <td key={column.key}>
                              <a className="admin-cell-link" href={pathValue}>
                                {String(normalized[column.key] || "")}
                              </a>
                            </td>
                          );
                        }
                      }

                      return <td key={column.key}>{String(normalized[column.key] || "")}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <nav className="employee-pagination" id="admin-list-pagination" aria-label="Admin list pages">
            <button
              type="button"
              className="pager-btn"
              data-admin-page-nav="first"
              disabled={table.currentPage <= 1}
              onClick={() => table.setPage(1)}
            >
              «
            </button>
            <button
              type="button"
              className="pager-btn"
              data-admin-page-nav="prev"
              disabled={table.currentPage <= 1}
              onClick={() => table.setPage(Math.max(1, table.currentPage - 1))}
            >
              ‹
            </button>
            {Array.from({ length: table.totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={`admin-page-${String(pageNumber)}`}
                type="button"
                className={`pager-btn${pageNumber === table.currentPage ? " is-current" : ""}`}
                data-admin-page={String(pageNumber)}
                onClick={() => table.setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              className="pager-btn"
              data-admin-page-nav="next"
              disabled={table.currentPage >= table.totalPages}
              onClick={() => table.setPage(Math.min(table.totalPages, table.currentPage + 1))}
            >
              ›
            </button>
            <button
              type="button"
              className="pager-btn"
              data-admin-page-nav="last"
              disabled={table.currentPage >= table.totalPages}
              onClick={() => table.setPage(table.totalPages)}
            >
              »
            </button>
          </nav>
        </>
      ) : null}

      {form ? (
        <form
          id="admin-form"
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!formSaveEnabled) {
              return;
            }
            setFormFeedback("Information saved.");
          }}
        >
          {formFields.map((field) => {
            const value = formValues[field.id] || "";

            if (field.type === "checkbox") {
              return (
                <label key={field.id} className="admin-checkbox-row">
                  <input
                    type="checkbox"
                    id={field.id}
                    checked={value === "true"}
                    onChange={(event) => {
                      setFormValues((current) => ({
                        ...current,
                        [field.id]: event.target.checked ? "true" : "false"
                      }));
                      setFormFeedback("");
                    }}
                  />
                  <span>{field.label}</span>
                </label>
              );
            }

            if (field.type === "textarea") {
              return (
                <label key={field.id} className="admin-form-field">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-danger">*</span> : null}
                  </span>
                  <textarea
                    id={field.id}
                    value={value}
                    onChange={(event) => {
                      setFormValues((current) => ({
                        ...current,
                        [field.id]: event.target.value
                      }));
                      setFormFeedback("");
                    }}
                  ></textarea>
                </label>
              );
            }

            if (field.type === "select") {
              return (
                <label key={field.id} className="admin-form-field">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-danger">*</span> : null}
                  </span>
                  <select
                    id={field.id}
                    value={value}
                    onChange={(event) => {
                      setFormValues((current) => ({
                        ...current,
                        [field.id]: event.target.value
                      }));
                      setFormFeedback("");
                    }}
                  >
                    {(field.options || []).map((option: { value: string; label: string }) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label key={field.id} className="admin-form-field">
                <span>
                  {field.label}
                  {field.required ? <span className="text-danger">*</span> : null}
                </span>
                <input
                  id={field.id}
                  type={field.type || "text"}
                  value={value}
                  onChange={(event) => {
                    setFormValues((current) => ({
                      ...current,
                      [field.id]: event.target.value
                    }));
                    setFormFeedback("");
                  }}
                />
              </label>
            );
          })}

          <div className="admin-form-actions">
            <button id="admin-form-save" type="submit" className="btn-primary" disabled={!formSaveEnabled}>
              {form.saveLabel || "Save"}
            </button>
            {form.dangerActionLabel ? (
              <button
                id="admin-form-danger"
                type="button"
                className="btn-secondary admin-danger-btn"
                onClick={() => setFormFeedback("Item deleted.")}
              >
                {form.dangerActionLabel}
              </button>
            ) : null}
            {form.cancelPath ? (
              <a className="btn-secondary" href={form.cancelPath}>
                Cancel
              </a>
            ) : null}
          </div>
          <div id="admin-form-feedback" className="profile-feedback" hidden={!formFeedback}>
            {formFeedback}
          </div>
        </form>
      ) : null}

      {adminPage.donationsTable ? (
        <table className="admin-table admin-table--compact">
          <thead>
            <tr>
              {(adminPage.donationsTable.columns || []).map((column, index) => (
                <th key={`don-col-${String(index)}`}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(adminPage.donationsTable.rows || []).map((row, index) => (
              <tr key={`don-row-${String(index)}`}>
                <td>{row.fullName}</td>
                <td>{row.amount}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {adminPage.refund ? (
        <section className="admin-refund-box">
          <p id="admin-refund-message">{refundMessage}</p>
          <div className="admin-form-actions">
            <button
              id="admin-refund-action"
              type="button"
              className="btn-primary"
              onClick={() => {
                setRefundMessage(String(adminPage.refund?.failedMessage || "Refund failed."));
              }}
            >
              {adminPage.refund.actionLabel || "Refund"}
            </button>
            {adminPage.refund.cancelPath ? (
              <a className="btn-secondary" href={adminPage.refund.cancelPath}>
                Cancel
              </a>
            ) : null}
          </div>
        </section>
      ) : null}
    </section>
  );
}

export function App({ initialData }: { initialData: RuntimeData }) {
  const runtimeData = initialData;

  useEffect(() => {
    window.__SIMOONA_RUNTIME_DATA__ = runtimeData;
  }, [runtimeData]);

  let mainContent = <FallbackView runtimeData={runtimeData} />;

  if (runtimeData.authUtilityPage) {
    mainContent = <AuthUtilityView runtimeData={runtimeData} />;
  } else if (runtimeData.clientFeaturePage) {
    mainContent = <ClientFeatureView runtimeData={runtimeData} />;
  } else if (runtimeData.employeeList) {
    mainContent = <EmployeeListView runtimeData={runtimeData} />;
  } else if (runtimeData.adminPage) {
    mainContent = <AdminView runtimeData={runtimeData} />;
  } else if (runtimeData.profilePage) {
    mainContent = <ProfileView runtimeData={runtimeData} />;
  } else if (runtimeData.settingsPage) {
    mainContent = <SettingsView runtimeData={runtimeData} />;
  } else if (runtimeData.wallFeed) {
    mainContent = <WallFeedView runtimeData={runtimeData} />;
  }

  return (
    <>
      <style>{legacyRuntimeStyles}</style>
      <AppShell runtimeData={runtimeData}>{mainContent}</AppShell>
    </>
  );
}
