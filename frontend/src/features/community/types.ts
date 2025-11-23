import type { User } from '../auth/types';

export interface Post {
    id: number;
    author: User;
    content: string;
    image: string | null;
    post_type: 'USER' | 'SYSTEM';
    created: string;
    like_count: number;
    comment_count: number;
    is_liked: boolean;
}

export interface Comment {
    id: number;
    post: number;
    author: User;
    text: string;
    created: string;
}

export interface CreatePostRequest {
    content: string;
    image?: File;
}

export interface FeedResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Post[];
}
