export interface UserAuthenticationLoginRequest {
    username: string;
    password: string;
}

export interface SessionData {
    user_id: string;
    user_name: string;
    expiry_date: Date;
}
