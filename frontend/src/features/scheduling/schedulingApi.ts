import { api } from '../../api/api';
import type { Poll, RSVP, CreateRSVPRequest, CreatePollRequest, PollsResponse, LocationsResponse } from './types';

export const schedulingApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getLocations: builder.query<LocationsResponse, void>({
            query: () => '/scheduling/locations/',
        }),
        getPolls: builder.query<PollsResponse, void>({
            query: () => '/scheduling/polls/',
            providesTags: (result) =>
                result
                    ? [
                        ...result.results.map(({ id }) => ({ type: 'Poll' as const, id })),
                        { type: 'Poll', id: 'LIST' }
                    ]
                    : [{ type: 'Poll', id: 'LIST' }],
        }),
        createPoll: builder.mutation<Poll, CreatePollRequest>({
            query: (data) => ({
                url: '/scheduling/polls/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Poll', id: 'LIST' }],
        }),
        createRSVP: builder.mutation<RSVP, { pollId: number; data: CreateRSVPRequest }>({
            query: ({ pollId, data }) => ({
                url: `/scheduling/polls/${pollId}/rsvp/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { pollId }) => [{ type: 'Poll', id: pollId }],
        }),
    }),
});

export const { useGetLocationsQuery, useGetPollsQuery, useCreatePollMutation, useCreateRSVPMutation } = schedulingApi;
