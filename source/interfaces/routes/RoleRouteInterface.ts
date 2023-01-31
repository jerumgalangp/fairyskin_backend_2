export interface RoleRouteInterface {
    id?: string | string[];
    role_name?: string;
    role_description?: string;
    recipient?: string;
}

export interface RoleRouteCreateInterface {
    role_name: string;
    role_description: string;
    recipient: string;
}

export interface RoleRouteUpdateInterface {
    id: string;
    role_name?: string;
    role_description?: string;
    recipient?: string;
}

export interface RoleRouteDeleteInterface {
    id: string;
}

export interface RoleRouteResetPasswordInterface {
    id: string;
    role_name: string;
    role_description: string;
    recipient: string;
}
