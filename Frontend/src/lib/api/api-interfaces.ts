export interface User {
    userID: number;
    email: string;
    displayName: string;
    adventureRank: number | null;
    accountName: string | null;
    isNewUser: boolean;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: User;
}

export interface GoogleSignInRequest {
    idToken: string;
    adventureRank?: number;
    accountName?: string;
}