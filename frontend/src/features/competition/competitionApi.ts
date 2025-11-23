import { api } from '../../api/api';
import type { Challenge, ChallengeResponse, CreateChallengeRequest } from './types';

export const competitionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getChallenges: builder.query<ChallengeResponse, void>({
            query: () => '/competition/challenges/',
            providesTags: ['Challenge'],
        }),
        createChallenge: builder.mutation<Challenge, CreateChallengeRequest>({
            query: (data) => ({
                url: '/competition/challenges/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Challenge'],
        }),
    }),
});

export const { useGetChallengesQuery, useCreateChallengeMutation } = competitionApi;
