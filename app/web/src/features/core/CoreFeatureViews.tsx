import { useState } from "react";
import type { RuntimeData } from "../../app/runtime-data";
import { useInteractiveTable } from "../../app/hooks/useInteractiveTable";

export function WallFeedView({ runtimeData }: { runtimeData: RuntimeData }) {
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

export function EmployeeListView({ runtimeData }: { runtimeData: RuntimeData }) {
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

export function ProfileView({ runtimeData }: { runtimeData: RuntimeData }) {
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

export function SettingsView({ runtimeData }: { runtimeData: RuntimeData }) {
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
