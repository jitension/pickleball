export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile: {
        skill_level: 'EMERGING' | 'INTERMEDIATE' | 'ADVANCED';
        status: string;
        avatar: string | null;
    };
}

export interface LoginRequest {
    email: string; // Changed from username to email as per backend
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    skill_level: 'EMERGING' | 'INTERMEDIATE' | 'ADVANCED';
}
