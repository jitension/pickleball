import type { User } from '../auth/types';

export interface Location {
    id: number;
    name: string;
    address: string;
    is_active: boolean;
}

export interface Poll {
    id: number;
    date: string;
    time_start: string;
    time_end: string;
    location: number;
    location_name: string;
    is_active: boolean;
    created: string;
    rsvp_counts: {
        IN: number;
        OUT: number;
        MAYBE: number;
        LATE: number;
    };
    skill_counts: {
        EMERGING: number;
        INTERMEDIATE: number;
        ADVANCED: number;
    };
    user_rsvp?: RSVP;
    rsvps: RSVP[];
}

export interface RSVP {
    id: number;
    poll: number;
    user: User;
    status: 'IN' | 'OUT' | 'MAYBE' | 'LATE';
    partner?: User;
    note: string;
    created: string;
}

export interface CreateRSVPRequest {
    status: 'IN' | 'OUT' | 'MAYBE' | 'LATE';
    partner?: number;
    note?: string;
}

export interface CreatePollRequest {
    date: string;
    time_start: string;
    time_end: string;
    location: number;
}

export interface PollsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Poll[];
}

export interface LocationsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Location[];
}
