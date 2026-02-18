import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchHomeExperience, type FeedPost } from '../api/homeExperience';

function formatReactionSummary(post: FeedPost, isLiked: boolean): string {
    const baseLikes = post.likeCount - (post.likedByCurrentUser ? 1 : 0);
    const likeCount = baseLikes + (isLiked ? 1 : 0);
    const replyLabel = post.replies.length === 1 ? 'reply' : 'replies';

    return `${likeCount} likes · ${post.replies.length} ${replyLabel}`;
}

export function HomePage() {
    const { t } = useTranslation();
    const [result, setResult] = useState<Awaited<ReturnType<typeof fetchHomeExperience>> | null>(null);
    const [likedByPostId, setLikedByPostId] = useState<Record<string, boolean>>({});
    const [replyExpandedByPostId, setReplyExpandedByPostId] = useState<Record<string, boolean>>({});
    const [repliesVisibleByPostId, setRepliesVisibleByPostId] = useState<Record<string, boolean>>({});

    useEffect(() => {
        let isMounted = true;

        async function loadHomeExperience() {
            const response = await fetchHomeExperience();

            if (!isMounted) {
                return;
            }

            setResult(response);
            if (response.feed.kind === 'success') {
                const nextLikes = Object.fromEntries(
                    response.feed.items.map((post) => [post.id, post.likedByCurrentUser]),
                );
                const nextExpanded = Object.fromEntries(response.feed.items.map((post) => [post.id, false]));
                const nextRepliesVisible = Object.fromEntries(response.feed.items.map((post) => [post.id, false]));

                setLikedByPostId(nextLikes);
                setReplyExpandedByPostId(nextExpanded);
                setRepliesVisibleByPostId(nextRepliesVisible);
            }
        }

        void loadHomeExperience();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="wall-page" aria-label="Wall page">
            <header className="wall-page-header">
                <h1 className="page-title">{t('home.title')}</h1>
                <p className="wall-page-subtitle">Legacy-like wall shell parity with compact feed and widgets.</p>
            </header>
            <div className="wall-content-grid" data-testid="wall-content-grid">
                <section aria-label="Feed stream" className="wall-feed-column" data-testid="wall-feed-column">
                    {result === null && (
                        <section className="wall-section-state" data-testid="wall-feed-loading" role="status">
                            <h2 className="wall-section-state-title">Feed loading</h2>
                            <p>Loading home feed...</p>
                        </section>
                    )}
                    {result?.feed.kind === 'unavailable' && (
                        <section className="wall-section-state wall-section-state--warning" data-testid="wall-feed-unavailable" role="alert">
                            <h2 className="wall-section-state-title">Feed unavailable</h2>
                            <p>{result.feed.reason}</p>
                        </section>
                    )}
                    {result?.feed.kind === 'empty' && (
                        <section className="wall-section-state" data-testid="wall-feed-empty" role="status">
                            <h2 className="wall-section-state-title">No feed posts yet</h2>
                            <p>Home feed fixtures are empty for this adapter snapshot.</p>
                        </section>
                    )}
                    {result?.feed.kind === 'success' &&
                        result.feed.items.map((post) => {
                            const isLiked = likedByPostId[post.id] ?? post.likedByCurrentUser;
                            const isReplyExpanded = replyExpandedByPostId[post.id] ?? false;
                            const repliesVisible = repliesVisibleByPostId[post.id] ?? false;

                            return (
                                <article
                                    aria-label={`Wall post by ${post.author}`}
                                    className="wall-post-card"
                                    data-testid="wall-post-card"
                                    key={post.id}
                                >
                                    <p className="wall-post-label-line" data-section="wall-label">
                                        {post.wallLabel}
                                    </p>
                                    <header className="wall-post-meta-line" data-section="meta">
                                        <span aria-hidden="true" className="wall-avatar">
                                            {post.author
                                                .split(' ')
                                                .map((part) => part[0])
                                                .join('')}
                                        </span>
                                        <div className="wall-post-meta-copy">
                                            <p className="wall-post-author">{post.author}</p>
                                            <p className="wall-post-timestamp">{post.timestamp}</p>
                                        </div>
                                    </header>
                                    <p className="wall-post-body" data-section="body">
                                        {post.text}
                                    </p>
                                    <div aria-label={post.mediaLabel} className="wall-post-media" data-section="media" />
                                    <p
                                        aria-label="Post reactions"
                                        className="wall-post-reaction-line wall-post-separator-row"
                                        data-section="reactions"
                                        data-testid="wall-post-reaction-line"
                                    >
                                        {formatReactionSummary(post, isLiked)}
                                    </p>
                                    <div
                                        aria-label="Wall post actions"
                                        className="wall-post-action-row wall-post-separator-row"
                                        data-section="actions"
                                        data-testid="wall-post-action-row"
                                    >
                                        <button
                                            className="wall-post-action-button"
                                            onClick={() => {
                                                setLikedByPostId((current) => ({
                                                    ...current,
                                                    [post.id]: !(current[post.id] ?? post.likedByCurrentUser),
                                                }));
                                            }}
                                            type="button"
                                        >
                                            {isLiked ? 'Unlike' : 'Like'}
                                        </button>
                                        <button
                                            className="wall-post-action-button"
                                            onClick={() => {
                                                setReplyExpandedByPostId((current) => ({
                                                    ...current,
                                                    [post.id]: !(current[post.id] ?? false),
                                                }));
                                            }}
                                            type="button"
                                        >
                                            {isReplyExpanded ? 'Collapse reply' : 'Reply'}
                                        </button>
                                        {post.replies.length > 0 && (
                                            <button
                                                className="wall-post-action-button wall-post-action-button--link"
                                                onClick={() => {
                                                    setRepliesVisibleByPostId((current) => ({
                                                        ...current,
                                                        [post.id]: !(current[post.id] ?? false),
                                                    }));
                                                }}
                                                type="button"
                                            >
                                                {repliesVisible ? 'Hide replies' : `Show replies (${post.replies.length})`}
                                            </button>
                                        )}
                                    </div>
                                    {post.replies.length > 0 && repliesVisible && (
                                        <section
                                            aria-label="Comment thread"
                                            className="wall-post-thread"
                                            data-section="thread"
                                            data-testid="wall-post-thread"
                                        >
                                            {post.replies.map((reply) => (
                                                <article className="wall-post-reply" key={reply.id}>
                                                    <div className="wall-post-reply-meta">
                                                        <p className="wall-post-reply-author">{reply.author}</p>
                                                        <p className="wall-post-reply-timestamp">{reply.timestamp}</p>
                                                    </div>
                                                    <p className="wall-post-reply-text">{reply.text}</p>
                                                </article>
                                            ))}
                                        </section>
                                    )}
                                    {isReplyExpanded && (
                                        <div
                                            className="wall-post-comment-row wall-post-separator-row"
                                            data-section="comment"
                                            data-testid="wall-post-comment-row"
                                        >
                                            <span aria-hidden="true" className="wall-avatar wall-avatar--comment">
                                                ME
                                            </span>
                                            <input
                                                aria-label="Prototype comment input"
                                                disabled
                                                placeholder="Commenting is disabled in prototype mode"
                                                type="text"
                                            />
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                </section>
                <aside aria-label="Wall widgets" className="wall-widgets-column" data-testid="wall-widgets-column">
                    {result === null && (
                        <section className="wall-section-state" data-testid="wall-widget-loading" role="status">
                            <h2 className="wall-section-state-title">Widgets loading</h2>
                            <p>Loading right-rail widgets...</p>
                        </section>
                    )}
                    {result?.widgets.kind === 'unavailable' && (
                        <section className="wall-section-state wall-section-state--warning" data-testid="wall-widget-unavailable" role="alert">
                            <h2 className="wall-section-state-title">Widgets unavailable</h2>
                            <p>{result.widgets.reason}</p>
                        </section>
                    )}
                    {result?.widgets.kind === 'empty' && (
                        <section className="wall-section-state" data-testid="wall-widget-empty" role="status">
                            <h2 className="wall-section-state-title">No widget fixtures yet</h2>
                            <p>Right-rail fixtures are empty for this adapter snapshot.</p>
                        </section>
                    )}
                    {result?.widgets.kind === 'success' &&
                        result.widgets.items.map((card) => (
                            <section className="wall-widget-card" data-testid="wall-widget-card" key={card.id}>
                                <header className="wall-widget-header">
                                    <h2 data-testid="wall-widget-heading">{card.title}</h2>
                                </header>
                                <ul aria-label={`${card.title} items`} data-testid="wall-widget-list">
                                    {card.rows.map((row) => (
                                        <li className="wall-widget-row" data-testid="wall-widget-row" key={row.id}>
                                            <p className="wall-widget-row-primary">{row.primary}</p>
                                            <p className="wall-widget-row-secondary">{row.secondary}</p>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                </aside>
            </div>
        </section>
    );
}
