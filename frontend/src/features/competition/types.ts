import type { User } from '../auth/types';

export const ChallengeStatus = {
    OPEN: 'OPEN',
    ACCEPTED: 'ACCEPTED',
    PLAYED: 'PLAYED',
    CANCELLED: 'CANCELLED',
} as const;

export type ChallengeStatus = typeof ChallengeStatus[keyof typeof ChallengeStatus];

export const ChallengeResult = {
    PASS: 'PASS',
    FAIL: 'FAIL',
} as const;

export type ChallengeResult = typeof ChallengeResult[keyof typeof ChallengeResult];

export interface Challenge {
    id: number;
    challenger_1: User;
    challenger_2: User;
    defender_1: User | null;
    defender_2: User | null;
    status: ChallengeStatus;
    result: ChallengeResult | null;
    score: string;
    created: string;
}

export interface CreateChallengeRequest {
    challenger_2: number; // ID of the partner
}

export interface ChallengeResponse {
    results: Challenge[];
    count: number;
    next: string | null;
    previous: string | null;
}
