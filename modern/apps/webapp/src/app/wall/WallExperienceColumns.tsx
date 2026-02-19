import { useEffect, useState } from 'react';
import { CardChrome, InfoMetaRow, ListRow } from '../ui/primitives';
import type { FeedPost, SectionState, WidgetCardData } from '../../api/wallExperienceTypes';

const widgetPriority: Record<string, number> = {
    'Kudos Feed': 0,
    'Upcoming Events': 1,
    Rankings: 2,
    Birthdays: 3,
};

function sortWidgetCards<T extends { id: string; title: string }>(cards: T[]): T[] {
    return [...cards].sort((left, right) => {
        const leftPriority = widgetPriority[left.title] ?? Number.MAX_SAFE_INTEGER;
        const rightPriority = widgetPriority[right.title] ?? Number.MAX_SAFE_INTEGER;

        if (leftPriority !== rightPriority) {
            return leftPriority - rightPriority;
        }

        return left.id.localeCompare(right.id);
    });
}

function formatReactionSummary(post: FeedPost, isLiked: boolean): string {
    const baseLikes = post.likeCount - (post.likedByCurrentUser ? 1 : 0);
    const likeCount = baseLikes + (isLiked ? 1 : 0);
    const likeLabel = likeCount === 1 ? 'person likes this' : 'people like this';
    const commentLabel = post.replies.length === 1 ? 'comment' : 'comments';

    return `${likeCount} ${likeLabel} · ${post.replies.length} ${commentLabel}`;
}

function formatRepliesToggleLabel(replyCount: number, repliesVisible: boolean): string {
    if (repliesVisible) {
        return 'Collapse replies';
    }

    if (replyCount <= 1) {
        return 'Show reply';
    }

    return `Show all replies (${replyCount})`;
}

function formatWidgetCountLabel(count: number): string {
    return `${count} ${count === 1 ? 'item' : 'items'}`;
}

export interface WallExperienceColumnsState {
    feed: SectionState<FeedPost>;
    widgets: SectionState<WidgetCardData>;
}

export interface WallExperienceColumnsCopy {
    feedLoadingTitle: string;
    feedLoadingMessage: string;
    feedUnavailableTitle: string;
    feedEmptyTitle: string;
    feedEmptyMessage: string;
    widgetsLoadingTitle: string;
    widgetsLoadingMessage: string;
    widgetsUnavailableTitle: string;
    widgetsEmptyTitle: string;
    widgetsEmptyMessage: string;
}

const defaultWallColumnsCopy: WallExperienceColumnsCopy = {
    feedLoadingTitle: 'Feed loading',
    feedLoadingMessage: 'Loading home feed...',
    feedUnavailableTitle: 'Feed unavailable',
    feedEmptyTitle: 'No feed posts yet',
    feedEmptyMessage: 'Home feed fixtures are empty for this adapter snapshot.',
    widgetsLoadingTitle: 'Widgets loading',
    widgetsLoadingMessage: 'Loading right-rail widgets...',
    widgetsUnavailableTitle: 'Widgets unavailable',
    widgetsEmptyTitle: 'No widget fixtures yet',
    widgetsEmptyMessage: 'Right-rail fixtures are empty for this adapter snapshot.',
};

export interface WallExperienceColumnsProps {
    result: WallExperienceColumnsState | null;
    copy?: Partial<WallExperienceColumnsCopy>;
    feedAriaLabel?: string;
    widgetsAriaLabel?: string;
}

export function WallExperienceColumns({
    result,
    copy,
    feedAriaLabel = 'Feed stream',
    widgetsAriaLabel = 'Wall widgets',
}: WallExperienceColumnsProps) {
    const labels = {
        ...defaultWallColumnsCopy,
        ...copy,
    };
    const [likedByPostId, setLikedByPostId] = useState<Record<string, boolean>>({});
    const [replyExpandedByPostId, setReplyExpandedByPostId] = useState<Record<string, boolean>>({});
    const [repliesVisibleByPostId, setRepliesVisibleByPostId] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (result?.feed.kind !== 'success') {
            return;
        }

        const nextLikes = Object.fromEntries(result.feed.items.map((post) => [post.id, post.likedByCurrentUser]));
        const nextExpanded = Object.fromEntries(result.feed.items.map((post) => [post.id, false]));
        const nextRepliesVisible = Object.fromEntries(result.feed.items.map((post) => [post.id, false]));

        setLikedByPostId(nextLikes);
        setReplyExpandedByPostId(nextExpanded);
        setRepliesVisibleByPostId(nextRepliesVisible);
    }, [result]);

    return (
        <div className="wall-content-grid" data-testid="wall-content-grid">
            <section aria-label={feedAriaLabel} className="wall-feed-column" data-testid="wall-feed-column">
                {result === null && (
                    <CardChrome as="section" className="wall-section-state" data-testid="wall-feed-loading" role="status">
                        <h2 className="wall-section-state-title">{labels.feedLoadingTitle}</h2>
                        <p>{labels.feedLoadingMessage}</p>
                    </CardChrome>
                )}
                {result?.feed.kind === 'unavailable' && (
                    <CardChrome
                        as="section"
                        className="wall-section-state wall-section-state--warning"
                        data-testid="wall-feed-unavailable"
                        role="alert"
                        tone="warning"
                    >
                        <h2 className="wall-section-state-title">{labels.feedUnavailableTitle}</h2>
                        <p>{result.feed.reason}</p>
                    </CardChrome>
                )}
                {result?.feed.kind === 'empty' && (
                    <CardChrome as="section" className="wall-section-state" data-testid="wall-feed-empty" role="status">
                        <h2 className="wall-section-state-title">{labels.feedEmptyTitle}</h2>
                        <p>{labels.feedEmptyMessage}</p>
                    </CardChrome>
                )}
                {result?.feed.kind === 'success' &&
                    result.feed.items.map((post) => {
                        const isLiked = likedByPostId[post.id] ?? post.likedByCurrentUser;
                        const isReplyExpanded = replyExpandedByPostId[post.id] ?? false;
                        const repliesVisible = repliesVisibleByPostId[post.id] ?? false;
                        const threadId = `wall-post-thread-${post.id}`;

                        return (
                            <CardChrome
                                as="article"
                                aria-label={`Wall post by ${post.author}`}
                                className="wall-post-card"
                                data-replies-visible={repliesVisible ? 'true' : 'false'}
                                data-reply-composer={isReplyExpanded ? 'expanded' : 'collapsed'}
                                data-testid="wall-post-card"
                                key={post.id}
                            >
                                <div className="wall-post-title-row" data-section="wall-title">
                                    <p className="wall-post-label-line" data-section="wall-label">
                                        {post.wallLabel}
                                    </p>
                                </div>
                                <header className="wall-post-meta-line" data-section="meta" data-testid="wall-post-meta-line">
                                    <span aria-hidden="true" className="wall-avatar">
                                        {post.author
                                            .split(' ')
                                            .map((part) => part[0])
                                            .join('')}
                                    </span>
                                    <InfoMetaRow
                                        className="wall-post-meta-copy"
                                        primary={post.author}
                                        primaryClassName="wall-post-author"
                                        secondary={post.timestamp}
                                        secondaryClassName="wall-post-timestamp wall-meta-muted"
                                    />
                                </header>
                                <p className="wall-post-body" data-section="body" data-testid="wall-post-body">
                                    {post.text}
                                </p>
                                <div className="wall-post-media-section" data-section="media" data-testid="wall-post-media-section">
                                    {post.mediaLabel ? (
                                        <div aria-label={post.mediaLabel} className="wall-post-media" data-testid="wall-post-media" />
                                    ) : (
                                        <p className="wall-post-media wall-post-media--none wall-meta-muted" data-testid="wall-post-media-none">
                                            No media attached
                                        </p>
                                    )}
                                </div>
                                <p
                                    aria-label="Post reactions"
                                    className="wall-post-reaction-line wall-post-separator-row wall-meta-muted"
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
                                        aria-pressed={isLiked}
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
                                        aria-pressed={isReplyExpanded}
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
                                            aria-controls={threadId}
                                            aria-expanded={repliesVisible}
                                            onClick={() => {
                                                setRepliesVisibleByPostId((current) => ({
                                                    ...current,
                                                    [post.id]: !(current[post.id] ?? false),
                                                }));
                                            }}
                                            type="button"
                                        >
                                            {formatRepliesToggleLabel(post.replies.length, repliesVisible)}
                                        </button>
                                    )}
                                </div>
                                {post.replies.length === 0 && (
                                    <p className="wall-post-thread-empty wall-post-separator-row" data-section="thread-empty">
                                        No replies yet in this snapshot
                                    </p>
                                )}
                                {post.replies.length > 0 && repliesVisible && (
                                    <section
                                        id={threadId}
                                        aria-label="Comment thread"
                                        className="wall-post-thread"
                                        data-section="thread"
                                        data-testid="wall-post-thread"
                                    >
                                        {post.replies.map((reply) => (
                                            <article
                                                className={`wall-post-reply${reply.depth === 1 ? ' wall-post-reply--nested' : ''}`}
                                                data-depth={reply.depth}
                                                data-testid="wall-post-reply"
                                                key={reply.id}
                                            >
                                                <span aria-hidden="true" className="wall-avatar wall-avatar--reply">
                                                    {reply.author
                                                        .split(' ')
                                                        .map((part) => part[0])
                                                        .join('')}
                                                </span>
                                                <div className="wall-post-reply-body">
                                                    <InfoMetaRow
                                                        className="wall-post-reply-meta"
                                                        primary={reply.author}
                                                        primaryClassName="wall-post-reply-author"
                                                        secondary={reply.timestamp}
                                                        secondaryClassName="wall-post-reply-timestamp"
                                                    />
                                                    <p className="wall-post-reply-text">{reply.text}</p>
                                                </div>
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
                                            placeholder="Reply publishing is disabled in this read-only prototype"
                                            type="text"
                                        />
                                        <button className="wall-post-comment-submit" disabled type="button">
                                            Reply
                                        </button>
                                    </div>
                                )}
                            </CardChrome>
                        );
                    })}
            </section>
            <aside aria-label={widgetsAriaLabel} className="wall-widgets-column" data-testid="wall-widgets-column">
                {result === null && (
                    <CardChrome as="section" className="wall-section-state" data-testid="wall-widget-loading" role="status">
                        <h2 className="wall-section-state-title">{labels.widgetsLoadingTitle}</h2>
                        <p>{labels.widgetsLoadingMessage}</p>
                    </CardChrome>
                )}
                {result?.widgets.kind === 'unavailable' && (
                    <CardChrome
                        as="section"
                        className="wall-section-state wall-section-state--warning"
                        data-testid="wall-widget-unavailable"
                        role="alert"
                        tone="warning"
                    >
                        <h2 className="wall-section-state-title">{labels.widgetsUnavailableTitle}</h2>
                        <p>{result.widgets.reason}</p>
                    </CardChrome>
                )}
                {result?.widgets.kind === 'empty' && (
                    <CardChrome as="section" className="wall-section-state" data-testid="wall-widget-empty" role="status">
                        <h2 className="wall-section-state-title">{labels.widgetsEmptyTitle}</h2>
                        <p>{labels.widgetsEmptyMessage}</p>
                    </CardChrome>
                )}
                {result?.widgets.kind === 'success' &&
                    sortWidgetCards(result.widgets.items).map((card) => (
                        <CardChrome as="section" className="wall-widget-card" data-testid="wall-widget-card" key={card.id}>
                            <header className="wall-widget-header">
                                <h2 className="wall-widget-heading" data-testid="wall-widget-heading">
                                    {card.title}
                                </h2>
                                <p className="wall-widget-meta wall-meta-muted" data-testid="wall-widget-meta">
                                    {formatWidgetCountLabel(card.rows.length)}
                                </p>
                            </header>
                            <ul aria-label={`${card.title} items`} data-testid="wall-widget-list">
                                {card.rows.map((row) => (
                                    <ListRow className="wall-widget-row" data-testid="wall-widget-row" key={row.id}>
                                        <InfoMetaRow
                                            primary={row.primary}
                                            primaryClassName="wall-widget-row-primary wall-widget-row-title"
                                            primaryTestId="wall-widget-row-title"
                                            secondary={row.secondary}
                                            secondaryClassName="wall-widget-row-secondary wall-widget-row-meta wall-meta-muted"
                                            secondaryTestId="wall-widget-row-meta"
                                        />
                                        {row.subtext && (
                                            <p className="wall-widget-row-subtext wall-meta-muted" data-testid="wall-widget-row-subtext">
                                                {row.subtext}
                                            </p>
                                        )}
                                    </ListRow>
                                ))}
                            </ul>
                        </CardChrome>
                    ))}
            </aside>
        </div>
    );
}
