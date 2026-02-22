import { ReactNode } from "react";
import { isPathActive } from "../../runtime/runtime-shared";
import type { RuntimeData } from "../runtime-data";

interface AppShellProps {
  runtimeData: RuntimeData;
  children: ReactNode;
}

export function AppShell({ runtimeData, children }: AppShellProps) {
  const leftMenuGroups = Array.isArray(runtimeData.leftMenu?.groups)
    ? runtimeData.leftMenu.groups
    : [];
  const topLinks = Array.isArray(runtimeData.navItems) ? runtimeData.navItems : [];
  const isAuthShell = runtimeData.shellMode === "auth";

  return (
    <main
      className="app-shell"
      data-app="simoona-modern-web-runtime"
      data-route-key={runtimeData.routeMatch?.routeKey || "unknown"}
    >
      {isAuthShell ? (
        <header className="topbar topbar--auth">
          <div className="brand">SIMOONA</div>
          <div className="topbar-auth-spacer"></div>
          <div className="topbar-right topbar-right--auth">
            {topLinks.map((item) => (
              <a key={item.id} href={item.path} className="top-nav-link" data-nav={item.id}>
                {item.title}
              </a>
            ))}
          </div>
        </header>
      ) : (
        <header className="topbar">
          <div className="brand">SIMOONA</div>
          <div className="topbar-search-wrap">
            <input
              className="topbar-search"
              type="search"
              placeholder="Search in walls..."
              aria-label="Search in walls"
            />
          </div>
          <div className="topbar-right">
            {topLinks.map((item) => (
              <a key={item.id} href={item.path} className="top-nav-link" data-nav={item.id}>
                {item.title}
              </a>
            ))}
            <span className="profile-name">{runtimeData.shell?.userName || "User"}</span>
            <span aria-hidden="true">⌄</span>
            <span aria-hidden="true">✉</span>
            <span className="counter-badge">{runtimeData.shell?.notificationCount || 0}</span>
          </div>
        </header>
      )}

      <section className={isAuthShell ? "shell-main shell-main--auth" : "shell-main"}>
        {!isAuthShell ? (
          <aside className="left-rail" data-ui="legacy-left-rail">
            {leftMenuGroups.map((group) => (
              <section key={group.id} className="left-menu-group menu-group" data-group={group.id}>
                <h3 className="left-menu-group-title">{group.title}</h3>
                <ul>
                  {Array.isArray(group.items)
                    ? group.items.map((item) => {
                        const activeClass = isPathActive(item.path, runtimeData.route)
                          ? " left-menu-link is-active"
                          : " left-menu-link";
                        const externalProps = item.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {};
                        return (
                          <li key={item.id}>
                            <a className={activeClass} href={item.path} {...externalProps}>
                              {item.label}
                            </a>
                          </li>
                        );
                      })
                    : null}
                </ul>
              </section>
            ))}
          </aside>
        ) : null}

        <section className={isAuthShell ? "shell-content shell-content--auth" : "shell-content"}>
          {children}
        </section>
      </section>
    </main>
  );
}
