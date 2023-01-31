export interface CustomerRouteInterface {
    id?: string | string[];
    user_id?: string;
    customer_email?: string;
    all_available?: string;
    customer_area?: string;
    customer_team?: string;
}

export interface CustomerRouteCreateInterface {
    user_id: string;
    customer_email: string;
    payment_sequence: number;
    customer_area: string;
    customer_team: string;
}

export interface CustomerRouteUpdateInterface {
    id: string;
    user_id?: string;
    customer_email?: string;
    payment_sequence?: number;
    customer_area?: string;
    customer_team?: string;
}

export interface CustomerRouteDeleteInterface {
    id: string;
}
