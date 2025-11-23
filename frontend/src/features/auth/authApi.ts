import { api } from '../../api/api';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from './types';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login/',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<User, RegisterRequest>({
            query: (data) => ({
                url: '/auth/register/',
                method: 'POST',
                body: data,
            }),
        }),
        getUser: builder.query<User, void>({
            query: () => '/users/me/',
            providesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetUserQuery } = authApi;
