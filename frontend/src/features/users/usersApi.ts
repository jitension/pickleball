import { api } from '../../api/api';
import type { User } from '../auth/types';

export const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users/',
            providesTags: ['User'],
            transformResponse: (response: any) => {
                // Handle both array and paginated responses
                return Array.isArray(response) ? response : (response.results || []);
            },
        }),
    }),
});

export const { useGetUsersQuery } = usersApi;
