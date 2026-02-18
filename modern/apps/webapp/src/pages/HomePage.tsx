import { useTranslation } from 'react-i18next';

interface FeedPost {
    id: string;
    wallLabel: string;
    author: string;
    timestamp: string;
    text: string;
    mediaLabel: string;
    reactions: string;
    likedByCurrentUser: boolean;
    replies: FeedReply[];
}

interface FeedReply {
    id: string;
    author: string;
    timestamp: string;
    text: string;
}

interface WidgetRow {
    id: string;
    primary: string;
    secondary: string;
}

interface WidgetCardData {
    id: string;
    title: string;
    rows: WidgetRow[];
}

const samplePosts: FeedPost[] = [
    {
        id: 'post-product-sync',
        wallLabel: 'Company Wall',
        author: 'Milda Vaitke',
        timestamp: 'Today at 10:24',
        text: 'Prototype sprint review is live. Please leave feedback on migration priorities before 15:00.',
        mediaLabel: 'Sprint update attachment preview',
        reactions: '12 likes · 4 replies',
        likedByCurrentUser: true,
        replies: [
            {
                id: 'reply-priority-audit',
                author: 'Greta Simonyte',
                timestamp: 'Today at 10:47',
                text: 'Reviewed. Auth migration and directory pagination should stay in this sprint scope.',
            },
            {
                id: 'reply-demo-order',
                author: 'Paulius Dainys',
                timestamp: 'Today at 11:03',
                text: 'Added demo order notes in the thread checklist so QA can mirror the flow.',
            },
        ],
    },
    {
        id: 'post-office-update',
        wallLabel: 'Engineering Wall',
        author: 'Tomas Petrauskas',
        timestamp: 'Today at 08:41',
        text: 'Office map draft for Q2 seating is ready. Team leads can review sections in the Company area.',
        mediaLabel: 'Office map screenshot placeholder',
        reactions: '8 likes · 0 replies',
        likedByCurrentUser: false,
        replies: [],
    },
];

const widgetCards: WidgetCardData[] = [
    {
        id: 'widget-kudos',
        title: 'Kudos Feed',
        rows: [
            {
                id: 'kudos-qa',
                primary: 'Egle thanked QA Team',
                secondary: 'Regression coverage for release candidate',
            },
            {
                id: 'kudos-api',
                primary: 'Jonas praised API Team',
                secondary: 'Auth hardening and endpoint cleanup',
            },
        ],
    },
    {
        id: 'widget-events',
        title: 'Upcoming Events',
        rows: [
            {
                id: 'event-demo',
                primary: 'Feb 20 · Product demo rehearsal',
                secondary: 'Main hall · 14:00',
            },
            {
                id: 'event-sync',
                primary: 'Feb 22 · Frontend migration sync',
                secondary: 'Room B4 · 10:00',
            },
            {
                id: 'event-allhands',
                primary: 'Feb 25 · Engineering all-hands',
                secondary: 'Townhall stream · 16:00',
            },
        ],
    },
    {
        id: 'widget-rankings',
        title: 'Rankings',
        rows: [
            {
                id: 'rank-platform',
                primary: '1. Platform Team',
                secondary: '91 points this week',
            },
            {
                id: 'rank-frontend',
                primary: '2. Frontend Team',
                secondary: '84 points this week',
            },
            {
                id: 'rank-data',
                primary: '3. Data Team',
                secondary: '79 points this week',
            },
        ],
    },
    {
        id: 'widget-birthdays',
        title: 'Birthdays',
        rows: [
            {
                id: 'birthday-monika',
                primary: 'Monika L.',
                secondary: 'Today',
            },
            {
                id: 'birthday-paulius',
                primary: 'Paulius K.',
                secondary: 'Tomorrow',
            },
        ],
    },
];

export function HomePage() {
    const { t } = useTranslation();

    return (
        <section className="wall-page" aria-label="Wall page">
            <header className="wall-page-header">
                <h1 className="page-title">{t('home.title')}</h1>
                <p className="wall-page-subtitle">Legacy-like wall shell parity with compact feed and widgets.</p>
            </header>
            <div className="wall-content-grid" data-testid="wall-content-grid">
                <section aria-label="Feed stream" className="wall-feed-column" data-testid="wall-feed-column">
                    {samplePosts.map((post) => (
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
                                {post.reactions}
                            </p>
                            <div
                                aria-label="Wall post actions"
                                className="wall-post-action-row wall-post-separator-row"
                                data-section="actions"
                                data-testid="wall-post-action-row"
                            >
                                <button aria-disabled="true" className="wall-post-action-button" disabled type="button">
                                    {post.likedByCurrentUser ? 'Unlike' : 'Like'}
                                </button>
                                <button aria-disabled="true" className="wall-post-action-button" disabled type="button">
                                    Reply
                                </button>
                            </div>
                            {post.replies.length > 0 && (
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
                            <div className="wall-post-comment-row wall-post-separator-row" data-section="comment" data-testid="wall-post-comment-row">
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
                        </article>
                    ))}
                </section>
                <aside aria-label="Wall widgets" className="wall-widgets-column" data-testid="wall-widgets-column">
                    {widgetCards.map((card) => (
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
