import { useTranslation } from 'react-i18next';

interface FeedPost {
    id: string;
    source: string;
    author: string;
    timestamp: string;
    text: string;
    mediaLabel: string;
}

const samplePosts: FeedPost[] = [
    {
        id: 'post-product-sync',
        source: 'Company Wall',
        author: 'Milda Vaitke',
        timestamp: 'Today at 10:24',
        text: 'Prototype sprint review is live. Please leave feedback on migration priorities before 15:00.',
        mediaLabel: 'Sprint update attachment preview',
    },
    {
        id: 'post-office-update',
        source: 'Engineering Wall',
        author: 'Tomas Petrauskas',
        timestamp: 'Today at 08:41',
        text: 'Office map draft for Q2 seating is ready. Team leads can review sections in the Company area.',
        mediaLabel: 'Office map screenshot placeholder',
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
                <section aria-label="Feed stream" className="wall-feed-column">
                    {samplePosts.map((post) => (
                        <article className="wall-post-card" key={post.id}>
                            <div className="wall-post-source">{post.source}</div>
                            <div className="wall-post-meta">
                                <span aria-hidden="true" className="wall-avatar">
                                    {post.author
                                        .split(' ')
                                        .map((part) => part[0])
                                        .join('')}
                                </span>
                                <div>
                                    <p className="wall-post-author">{post.author}</p>
                                    <p className="wall-post-timestamp">{post.timestamp}</p>
                                </div>
                            </div>
                            <p className="wall-post-text">{post.text}</p>
                            <div aria-label={post.mediaLabel} className="wall-post-media" />
                            <div aria-label="Post reactions" className="wall-post-actions">
                                <button type="button">Like</button>
                                <button type="button">Comment</button>
                                <button type="button">Share</button>
                            </div>
                            <div className="wall-post-comment-row">
                                <input disabled placeholder="Commenting is disabled in prototype mode" type="text" />
                            </div>
                        </article>
                    ))}
                </section>
                <aside aria-label="Wall widgets" className="wall-widgets-column">
                    <section className="wall-widget-card">
                        <h2>Kudos Feed</h2>
                        <ul>
                            <li>
                                <strong>Egle</strong> thanked <strong>QA Team</strong> for regression coverage.
                            </li>
                            <li>
                                <strong>Jonas</strong> acknowledged <strong>API Team</strong> for auth hardening.
                            </li>
                        </ul>
                    </section>
                    <section className="wall-widget-card">
                        <h2>Upcoming Events</h2>
                        <ul>
                            <li>Feb 20: Product demo rehearsal</li>
                            <li>Feb 22: Frontend migration sync</li>
                            <li>Feb 25: Engineering all-hands</li>
                        </ul>
                    </section>
                    <section className="wall-widget-card">
                        <h2>Rankings</h2>
                        <ol>
                            <li>Platform Team</li>
                            <li>Frontend Team</li>
                            <li>Data Team</li>
                        </ol>
                    </section>
                    <section className="wall-widget-card">
                        <h2>Birthdays</h2>
                        <ul>
                            <li>Monika L. - Today</li>
                            <li>Paulius K. - Tomorrow</li>
                        </ul>
                    </section>
                </aside>
            </div>
        </section>
    );
}
