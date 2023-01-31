export interface ProductRouteInterface {
    id?: string | string[];
    product_code?: string;
    product_name?: string;
    quantity?: number;
    ordered_quantity?: number;
    forecasted_quantity?: number;
    approval_ind?: string;
}

export interface ProductRouteCreateInterface {
    product_code: string;
    product_name: string;
    quantity: number;
    ordered_quantity: number;
    forecasted_quantity: number;
    approval_ind: string;
    reference_value: string;
}

export interface ProductRouteUpdateInterface {
    id: string;
    product_code?: string;
    product_name?: string;
    quantity?: number;
    ordered_quantity?: number;
    forecasted_quantity?: number;
    approval_ind?: string;
    reference_value?: string;
}

export interface ProductRouteDeleteInterface {
    id: string;
}

export interface ProductRouteResetPasswordInterface {
    id: string;
    product_code: string;
    product_name: string;
    quantity: number;
    ordered_quantity: number;
    forecasted_quantity: number;
    approval_ind: string;
}
