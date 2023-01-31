export interface UserAuthenticationLoginRequest {
    username: string;
    password: string;
}

export interface SessionData {
    user_id: string;
    user_name: string;
    expiry_date: Date;
}

export interface UserRouteInterface {
    id?: string | string[];
    name?: string;
    username?: string;
    password?: string;
    address?: string;
    contact_number?: string;
    role_id?: string;
    type?: string;
}

export interface UserRouteCreateInterface {
    name: string;
    username: string;
    password: string;
    address: string;
    contact_number: string;
    role_id: string;
    type?: string;
}

export interface UserRouteUpdateInterface {
    id: string;
    name?: string;
    username?: string;
    password?: string;
    address?: string;
    contact_number?: string;
    role_id?: string;
    type?: string;
}

export interface UserRouteDeleteInterface {
    id: string;
}

export interface UserRouteResetPasswordInterface {
    id: string;
    password: string;
    force_ind: string;
    type?: string;
}
