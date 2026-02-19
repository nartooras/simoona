import type { DataSource } from './dataSource';

export interface FeedReply {
    id: string;
    author: string;
    timestamp: string;
    text: string;
    depth: 0 | 1;
}

export interface FeedPost {
    id: string;
    wallLabel: string;
    author: string;
    timestamp: string;
    text: string;
    mediaLabel?: string;
    likeCount: number;
    likedByCurrentUser: boolean;
    replies: FeedReply[];
}

export interface WidgetRow {
    id: string;
    primary: string;
    secondary: string;
    subtext?: string;
}

export interface WidgetCardData {
    id: string;
    title: string;
    rows: WidgetRow[];
}

export type SectionState<T> =
    | {
          kind: 'success';
          adapter: Extract<DataSource, 'real' | 'mock'>;
          items: T[];
      }
    | {
          kind: 'empty';
          adapter: Extract<DataSource, 'real' | 'mock'>;
      }
    | {
          kind: 'unavailable';
          adapter: DataSource;
          reason: string;
      };

export function resolveSection<T>(
    source: DataSource,
    adapters: Record<Extract<DataSource, 'real' | 'mock'>, () => T[]>,
    unavailableReason: string,
): SectionState<T> {
    if (source === 'disabled') {
        return {
            kind: 'unavailable',
            adapter: source,
            reason: unavailableReason,
        };
    }

    const items = adapters[source]();
    if (items.length === 0) {
        return {
            kind: 'empty',
            adapter: source,
        };
    }

    return {
        kind: 'success',
        adapter: source,
        items,
    };
}
