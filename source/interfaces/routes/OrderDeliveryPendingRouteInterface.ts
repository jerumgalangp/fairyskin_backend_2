export interface OrderDeliveryPendingRouteInterface {
    id?: string | string[];
    si_number?: string;
    remarks?: string;
    status?: string;
    products?: [];
    approval_ind?: string;
    reference_value?: string;
}

export interface OrderDeliveryPendingRouteUpdateInterface {
    id: string;
    si_number: string;
    remarks?: string;
    status?: string;
    products: [];
    approval_ind?: string;
    reference_value?: string;
    delivered_date: Date;
}

export interface OrderDeliveryPendingRouteApprovalInterface {
    id: string;
    si_number?: string;
    remarks?: string;
    status?: string;
    products?: [];
    transaction_status: string;
    event_request: string;
    order_id: string;
    order_status: string;
    order_remarks: string;
    delivered_date: Date;
}
