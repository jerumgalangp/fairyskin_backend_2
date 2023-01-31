export interface InvoiceRouteInterface {
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
    df?: string;
    dt?: string;
}

export interface InvoiceRouteCreateInterface {
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

export interface InvoiceRouteUpdateInterface {
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
    est_weight?: string;
    special_note?: string;
    shipping_details?: string;
    transportation?: string;
    carrier?: string;
    delivery_fee?: number;
    down_payment?: number;
}

export interface InvoiceRouteDeleteInterface {
    id: string;
}

export interface InvoiceRouteResetPasswordInterface {
    id: string;
    Invoice_code: string;
    Invoice_name: string;
    quantity: number;
    ordered_quantity: number;
    forecasted_quantity: number;
    approval_ind: string;
    est_weight: string;
    special_note: string;
    shipping_details: string;
    transportation: string;
    carrier: string;
    delivery_fee: number;
    down_payment: number;
}
