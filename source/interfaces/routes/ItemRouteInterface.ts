export interface ItemRouteInterface {
    id?: string | string[];
    item_code?: string;
    amount_mine?: number;
    amount_grab?: number;
    size_waist?: string;
    size_length?: string;
    size?: string;
    details?: string;
    filepath?: string;
    filename?: string;
    item_category_id?: string | [];
    buyer_id?: string;
    item_status_id?: string | [];
}

export interface ItemRouteCreateInterface {
    item_code: string;
    amount_mine: number;
    amount_grab: number;
    size_waist?: string;
    size_length?: string;
    size?: string;
    details: string;
    filepath: string;
    filename: string;
    item_category_id: string;
    item_status_id: string;
}

export interface ItemRouteUpdateInterface {
    id: string;
    item_code?: string;
    amount_mine?: number;
    amount_grab?: number;
    size_waist?: string;
    size_length?: string;
    size?: string;
    details?: string;
    filepath?: string;
    filename?: string;
    item_category_id?: string;
    item_status_id?: string;
}

export interface ItemRouteDeleteInterface {
    id: string[];
}

export interface ItemRouteUpdateStatusInterface {
    id: string[];
    status: string;
}
