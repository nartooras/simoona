const root = document.getElementById("app");
const runtimeDataElement = document.getElementById("simoona-runtime-data");

if (!root || !runtimeDataElement) {
  throw new Error("Missing runtime root elements.");
}

let runtimeData = {
  route: "/",
  title: "Simoona",
  status: "ready",
  navItems: [],
  auth: {
    requiresLogin: false,
    redirectPath: "/"
  },
  routeMatch: {
    routeKey: "public.home",
    normalizedPath: "/",
    isKnownLegacyRoute: true
  },
  tenantRoute: {
    tenantId: "default",
    normalizedPath: "/"
  },
  motion: {
    pageTransitionMs: 160,
    microInteractionMs: 120,
    reducedMotionEnabled: false
  }
};

try {
  const parsed = JSON.parse(runtimeDataElement.textContent || "{}");
  runtimeData = { ...runtimeData, ...parsed };
} catch (error) {
  console.error("[web-runtime] Failed to parse runtime payload:", error);
}

const navLinks = (runtimeData.navItems || [])
  .map((item) => `<a href="${item.path}" data-nav="${item.id}" class="shell-link">${item.title}</a>`)
  .join("");

const wallFeedData = runtimeData.wallFeed;
const postCards = Array.isArray(wallFeedData?.posts)
  ? wallFeedData.posts
      .map(
        (post) => `
      <article class="feed-card" data-post-id="${post.id}">
        <header class="feed-card-header">
          <img class="avatar" alt="${post.author}" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />
          <div>
            <p class="author">${post.author}</p>
            <p class="meta">${post.timestamp}</p>
          </div>
        </header>
        <p class="content">${post.content}</p>
        <footer class="actions">
          <button type="button" class="action-like" data-like-for="${post.id}">Like</button>
          <span class="counter" data-like-count="${post.id}">${post.likeCount}</span>
          <button type="button" class="action-reply" data-reply-for="${post.id}">Reply</button>
          <span class="counter">${post.commentCount}</span>
        </footer>
        <form class="reply-form" data-reply-form="${post.id}" hidden>
          <input type="text" placeholder="Write a comment..." aria-label="Comment for ${post.id}" />
        </form>
      </article>
    `
      )
      .join("")
  : "";

const leftNavGroups = Array.isArray(wallFeedData?.sections?.leftNav?.groups)
  ? wallFeedData.sections.leftNav.groups
      .map(
        (group) => `
      <section class="menu-group">
        <h3>${group.title}</h3>
        <ul>${group.items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>
    `
      )
      .join("")
  : "";

const rightWidgets = Array.isArray(wallFeedData?.sections?.rightSidebar)
  ? wallFeedData.sections.rightSidebar
      .map(
        (widget) => `
      <section class="widget">
        <h3>${widget.title}</h3>
        <ul>${widget.items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>
    `
      )
      .join("")
  : "";

const wallFeedLayout = wallFeedData
  ? `
    <div class="legacy-frame">
      <aside class="left-rail" data-ui="legacy-left-rail">${leftNavGroups}</aside>
      <section class="feed-column" data-ui="legacy-feed-column">${postCards}</section>
      <aside class="right-rail" data-ui="legacy-right-rail">${rightWidgets}</aside>
    </div>
  `
  : `
    <section class="fallback-card">
      <p><strong>Route:</strong> ${runtimeData.route}</p>
      <p><strong>Status:</strong> ${runtimeData.status}</p>
      <p><strong>Route key:</strong> ${runtimeData.routeMatch?.routeKey || "unknown"}</p>
      <p><strong>Tenant:</strong> ${runtimeData.tenantRoute?.tenantId || "default"}</p>
      <p><strong>Auth requires login:</strong> ${String(runtimeData.auth?.requiresLogin)}</p>
    </section>
  `;

root.innerHTML = `
  <style>
    :root {
      --page-bg: #eef2f7;
      --header-blue: #0f63b6;
      --header-blue-dark: #0a4f91;
      --card-bg: #ffffff;
      --border: #d8dfe8;
      --text-main: #1d2a3a;
      --text-muted: #6a7480;
      --link: #0f63b6;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Trebuchet MS", "Segoe UI", sans-serif;
      color: var(--text-main);
      background: var(--page-bg);
    }
    .header {
      display: grid;
      grid-template-columns: 220px minmax(220px, 1fr) 260px;
      gap: 12px;
      align-items: center;
      padding: 10px 16px;
      background: linear-gradient(180deg, var(--header-blue), var(--header-blue-dark));
      color: #fff;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .brand {
      font-weight: 700;
      letter-spacing: 1.5px;
      font-size: 18px;
    }
    .search {
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.35);
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
      border-radius: 3px;
      height: 32px;
      padding: 0 10px;
      font-size: 13px;
    }
    .search::placeholder { color: rgba(255, 255, 255, 0.8); }
    .top-links {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      flex-wrap: wrap;
    }
    .shell-link {
      color: #d9ebff;
      text-decoration: none;
      font-size: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 3px 7px;
      border-radius: 3px;
    }
    .main {
      padding: 12px;
      margin: 0 auto;
      max-width: 1480px;
    }
    .legacy-frame {
      display: grid;
      grid-template-columns: 260px minmax(520px, 1fr) 300px;
      gap: 12px;
      align-items: start;
    }
    .left-rail, .right-rail, .feed-card, .fallback-card, .widget, .menu-group {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 2px;
    }
    .menu-group {
      margin-bottom: 10px;
      padding: 10px;
    }
    .menu-group h3 {
      margin: 0 0 8px 0;
      font-size: 13px;
      color: #274f7a;
      border-bottom: 1px solid var(--border);
      padding-bottom: 5px;
    }
    .menu-group ul, .widget ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .menu-group li, .widget li {
      font-size: 12px;
      padding: 5px 0;
      border-bottom: 1px solid #eef2f6;
    }
    .feed-column {
      display: grid;
      gap: 10px;
    }
    .feed-card {
      padding: 10px;
    }
    .feed-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .avatar {
      width: 34px;
      height: 34px;
      background: #cad6e6;
      border: 1px solid #b4c4d8;
      border-radius: 2px;
    }
    .author {
      margin: 0;
      font-size: 13px;
      font-weight: 700;
    }
    .meta {
      margin: 2px 0 0 0;
      font-size: 11px;
      color: var(--text-muted);
    }
    .content {
      margin: 0 0 10px 0;
      font-size: 13px;
      line-height: 1.35;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px solid #e7edf4;
      font-size: 12px;
    }
    .actions button {
      border: 1px solid #c5d4e6;
      background: #f6f9fd;
      color: var(--link);
      border-radius: 3px;
      font-size: 12px;
      padding: 2px 8px;
      cursor: pointer;
    }
    .counter {
      min-width: 16px;
      text-align: center;
      color: #445468;
    }
    .reply-form {
      margin-top: 8px;
      border-top: 1px solid #e7edf4;
      padding-top: 8px;
    }
    .reply-form input {
      width: 100%;
      height: 30px;
      border: 1px solid #cbd8e8;
      border-radius: 3px;
      padding: 0 8px;
      font-size: 12px;
    }
    .widget {
      margin-bottom: 10px;
      padding: 10px;
    }
    .widget h3 {
      margin: 0 0 8px 0;
      font-size: 13px;
      color: #274f7a;
      border-bottom: 1px solid var(--border);
      padding-bottom: 5px;
    }
    .fallback-card {
      padding: 12px;
      font-size: 13px;
    }
    @media (max-width: 1200px) {
      .legacy-frame { grid-template-columns: 220px minmax(420px, 1fr) 260px; }
    }
    @media (max-width: 980px) {
      .header { grid-template-columns: 1fr; }
      .legacy-frame { grid-template-columns: 1fr; }
      .left-rail, .right-rail { order: 2; }
      .feed-column { order: 1; }
    }
  </style>
  <main data-app="simoona-modern-web-runtime" data-route-key="${runtimeData.routeMatch?.routeKey || "unknown"}">
    <header class="header">
      <div class="brand">SIMOONA</div>
      <input class="search" type="search" placeholder="Search people, walls, events..." />
      <nav class="top-links">${navLinks}</nav>
    </header>
    <section class="main">${wallFeedLayout}</section>
  </main>
`;

for (const likeButton of root.querySelectorAll(".action-like")) {
  likeButton.addEventListener("click", () => {
    const postId = likeButton.getAttribute("data-like-for");
    const countNode = postId ? root.querySelector(`[data-like-count="${postId}"]`) : null;
    const value = Number.parseInt(countNode?.textContent ?? "0", 10);
    if (countNode) {
      countNode.textContent = String(Number.isNaN(value) ? 1 : value + 1);
    }
  });
}

for (const replyButton of root.querySelectorAll(".action-reply")) {
  replyButton.addEventListener("click", () => {
    const postId = replyButton.getAttribute("data-reply-for");
    const form = postId ? root.querySelector(`[data-reply-form="${postId}"]`) : null;
    if (form) {
      const hidden = form.hasAttribute("hidden");
      if (hidden) {
        form.removeAttribute("hidden");
      } else {
        form.setAttribute("hidden", "");
      }
    }
  });
}
