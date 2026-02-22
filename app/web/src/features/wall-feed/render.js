import { escapeHtml } from "../../runtime/runtime-shared.js";

export function renderWallFeed(runtimeData) {
  const wallFeed = runtimeData.wallFeed;
  if (!wallFeed) {
    return "";
  }

  const postsMarkup = Array.isArray(wallFeed.posts)
    ? wallFeed.posts
        .map(
          (post) => `
        <article class="feed-card" data-post-id="${escapeHtml(post.id)}">
          <header class="feed-card-topline">
            <span class="feed-wall-name">${escapeHtml(post.wallName)}</span>
            <span class="feed-header-icons">☆ ⌁</span>
          </header>
          <header class="feed-card-header">
            <div class="avatar" aria-hidden="true"></div>
            <div>
              <p class="author">${escapeHtml(post.author)}</p>
              <p class="meta">${escapeHtml(post.timestamp)}</p>
            </div>
          </header>
          <p class="content">${escapeHtml(post.content)}</p>
          ${post.hasImage ? '<div class="post-image" aria-hidden="true"></div>' : ""}
          <p class="hashtags">${escapeHtml(post.hashtags || "")}</p>
          <div class="likes-summary">${escapeHtml(post.likeSummary || "")}</div>
          <footer class="actions">
            <button type="button" class="action-link action-like" data-like-for="${escapeHtml(post.id)}">Unlike</button>
            <button type="button" class="action-link action-reply" data-reply-for="${escapeHtml(post.id)}">Reply</button>
          </footer>
          <form class="reply-form" data-reply-form="${escapeHtml(post.id)}" hidden>
            <input type="text" placeholder="Add comment" aria-label="Comment for ${escapeHtml(post.id)}" />
          </form>
          <div class="reply-toggle">${escapeHtml(post.replyCountLabel || "")}</div>
          <div class="feed-counter-row">
            <span data-like-count="${escapeHtml(post.id)}">${escapeHtml(post.likeCount)}</span> likes
            <span class="separator-dot">•</span>
            <span>${escapeHtml(post.commentCount)}</span> replies
          </div>
        </article>
      `
        )
        .join("")
    : "";

  const quickActionsMarkup = Array.isArray(wallFeed.rightSidebar?.quickActions)
    ? wallFeed.rightSidebar.quickActions
        .map(
          (action) => `
      <button type="button" class="quick-action" title="${escapeHtml(action.title)}">${escapeHtml(action.symbol)}</button>
    `
        )
        .join("")
    : "";

  const kudosFeedMarkup = Array.isArray(wallFeed.rightSidebar?.kudosFeed)
    ? wallFeed.rightSidebar.kudosFeed
        .map(
          (entry) => `
      <li class="kudos-item">
        <div class="kudos-score">${escapeHtml(entry.score)}</div>
        <div class="kudos-text">
          <strong>${escapeHtml(entry.fullName)}</strong>
          <p>${escapeHtml(entry.reason)}</p>
          <span>${escapeHtml(entry.date)}</span>
        </div>
      </li>
    `
        )
        .join("")
    : "";

  const widgetsMarkup = Array.isArray(wallFeed.rightSidebar?.widgets)
    ? wallFeed.rightSidebar.widgets
        .map(
          (widget) => `
      <section class="widget-card">
        <h3>${escapeHtml(widget.title)}</h3>
        <ul>
          ${(widget.items || [])
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}
        </ul>
      </section>
    `
        )
        .join("")
    : "";

  return `
    <div class="content-grid content-grid--wall">
      <section class="feed-column" data-ui="legacy-feed-column">
        ${postsMarkup}
      </section>
      <aside class="right-rail" data-ui="legacy-right-rail">
        <section class="quick-actions">${quickActionsMarkup}</section>
        <section class="kudos-stream"><ul>${kudosFeedMarkup}</ul></section>
        ${widgetsMarkup}
      </aside>
    </div>
  `;
}

