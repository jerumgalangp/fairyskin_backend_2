export interface AreaRouteInterface {
    id?: string | string[];
    area_name?: string;
}

export interface AreaRouteCreateInterface {
    area_name: string;
}

export interface AreaRouteUpdateInterface {
    id: string;
    area_name?: string;
}

export interface AreaRouteDeleteInterface {
    id: string;
}

export interface AreaRouteResetPasswordInterface {
    id: string;
    area_name: string;
}
