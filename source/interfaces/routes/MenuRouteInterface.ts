export interface MenuRouteInterface {
    id?: string | string[];
    menu_name?: string;
    role_id?: string;
}

export interface MenuRouteCreateInterface {
    menu_name: string;
    role_id: string;
}

export interface MenuRouteUpdateInterface {
    id: string;
    menu_name?: string[];
    role_id?: string;
}

export interface MenuRouteDeleteInterface {
    id: string;
}

export interface MenuRouteResetPasswordInterface {
    id: string;
    menu_name: string;
    role_id: string;
}
