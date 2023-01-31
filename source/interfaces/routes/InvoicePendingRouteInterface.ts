export interface InvoicePendingRouteInterface {
    id?: string | string[];
    invoice_code?: string;
    invoice_date?: Date;
    discount?: number;
    total_order?: number;
    amount_to_pay?: number;
    over_payment?: number;
    invoice_order_id?: string;
    approval_ind?: string;
    reference_value?: string;
    est_weight?: string;
    special_note?: string;
    shipping_details?: string;
    transportation?: string;
    carrier?: string;
    delivery_fee?: number;
    down_payment?: number;
}

export interface InvoicePendingRouteCreateInterface {
    invoice_code: string;
    invoice_date: Date;
    discount: number;
    total_order: number;
    amount_to_pay: number;
    over_payment: number;
    invoice_order_id: string;
    si_number: string;
    approval_ind: string;
    reference_value: string;
    est_weight: string;
    special_note: string;
    shipping_details: string;
    transportation: string;
    carrier: string;
    delivery_fee: number;
    down_payment: number;
}

export interface InvoicePendingRouteUpdateInterface {
    id: string;
    invoice_code: string;
    invoice_date?: Date;
    discount?: number;
    total_order?: number;
    amount_to_pay?: number;
    over_payment?: number;
    invoice_order_id?: string;
    si_number?: string;
    approval_ind?: string;
    reference_value?: string;
    est_weight?: string;
    special_note?: string;
    shipping_details?: string;
    transportation?: string;
    carrier?: string;
    delivery_fee?: number;
    down_payment?: number;
}

export interface InvoicePendingRouteApprovalInterface {
    id: string;
    invoice_code?: string;
    invoice_date?: Date;
    discount?: number;
    total_order?: number;
    amount_to_pay?: number;
    over_payment?: number;
    invoice_order_id?: string;
    approval_ind?: string;
    reference_value?: string;
    status: string;
    event_request: string;
    est_weight: string;
    special_note: string;
    shipping_details: string;
    transportation: string;
    carrier: string;
    delivery_fee: number;
    down_payment: number;
}

export interface InvoicePendingRouteDeleteInterface {
    id: string;
}

export interface InvoicePendingRouteResetPasswordInterface {
    id: string;
    invoice_code: string;
    invoice_date: Date;
    discount: number;
    total_order: number;
    amount_to_pay: number;
    over_payment: number;
    invoice_order_id: string;
    approval_ind: string;
    reference_value: string;
    est_weight: string;
    special_note: string;
    shipping_details: string;
    transportation: string;
    carrier: string;
    delivery_fee: number;
    down_payment: number;
}
