import { api } from '../../api/api';
import type { Post, CreatePostRequest, FeedResponse, Comment } from './types';

export const communityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFeed: builder.query<FeedResponse, void>({
            query: () => '/community/feed/',
            providesTags: (result) =>
                result
                    ? [
                        ...result.results.map(({ id }) => ({ type: 'Post' as const, id })),
                        { type: 'Post', id: 'LIST' }
                    ]
                    : [{ type: 'Post', id: 'LIST' }],
        }),
        getPost: builder.query<Post, number>({
            query: (id) => `/community/posts/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Post', id }],
        }),
        getComments: builder.query<Comment[], number>({
            query: (postId) => `/community/posts/${postId}/comments/`,
            transformResponse: (response: { results: Comment[] }) => response.results,
            providesTags: (_result, _error, postId) => [{ type: 'Post', id: postId }],
        }),
        createPost: builder.mutation<Post, CreatePostRequest>({
            query: (data) => ({
                url: '/community/feed/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Post', id: 'LIST' }],
        }),
        createComment: builder.mutation<Comment, { postId: number; text: string }>({
            query: ({ postId, text }) => ({
                url: `/community/posts/${postId}/comments/`,
                method: 'POST',
                body: { text },
            }),
            invalidatesTags: (_result, _error, { postId }) => [{ type: 'Post', id: postId }],
        }),
        likePost: builder.mutation<void, number>({
            query: (postId) => ({
                url: `/community/posts/${postId}/like/`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, postId) => [{ type: 'Post', id: postId }],
        }),
    }),
});

export const {
    useGetFeedQuery,
    useGetPostQuery,
    useGetCommentsQuery,
    useCreatePostMutation,
    useCreateCommentMutation,
    useLikePostMutation
} = communityApi;
