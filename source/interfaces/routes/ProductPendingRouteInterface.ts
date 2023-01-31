export interface ProductPendingRouteInterface {
    id?: string | string[];
    product_code?: string;
    product_name?: string;
    quantity?: number;
    ordered_quantity?: number;
    forecasted_quantity?: number;
    approval_ind?: string;
    reference_value?: string;
}

export interface ProductPendingRouteCreateInterface {
    product_code: string;
    product_name: string;
    quantity: number;
    ordered_quantity: number;
    forecasted_quantity: number;
    approval_ind: string;
    reference_value: string;
}

export interface ProductPendingRouteUpdateInterface {
    id: string;
    product_code: string;
    product_name: string;
    quantity?: number;
    ordered_quantity?: number;
    forecasted_quantity?: number;
    approval_ind?: string;
    reference_value?: string;
}

export interface ProductPendingRouteApprovalInterface {
    id: string;
    product_code?: string;
    product_name?: string;
    quantity: number;
    ordered_quantity?: number;
    forecasted_quantity?: number;
    approval_ind?: string;
    reference_value?: string;
    status: string;
    event_request: string;
}

export interface ProductPendingRouteDeleteInterface {
    id: string;
}

export interface ProductPendingRouteResetPasswordInterface {
    id: string;
    product_code: string;
    product_name: string;
    quantity: number;
    ordered_quantity: number;
    forecasted_quantity: number;
    approval_ind: string;
    reference_value: string;
}
