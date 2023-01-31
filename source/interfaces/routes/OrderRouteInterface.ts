export interface OrderRouteInterface {
    id?: string | string[];
    order_name?: string;
    order_reference_number?: string;
    order_customer_id?: string | [];
    order_amount?: string;
    order_due_date?: string;
    order_filename?: string;
    order_filepath?: string;
    order_document_no?: string;
    order_fully_paid_date?: string;
    order_paid_amount?: string;
    order_last_payment_amount?: string;
    order_process_date?: string;
    df?: string;
    dt?: string;
    from_report?: string;
    order_status?: string;
}

export interface OrderRouteCreateInterface {
    si_number: string;
    customer_id: string;
    products: [];
    order_status: string;
    payment_status: string;
    order_date: Date;
    amount_to_pay: number;
    o_amount_to_pay: number;
    has_over_payment: number;
    payment_remarks: string;
    payment_balance: number;
    payment_amount: number;
    account_balance: number;
    over_payment: number;
    payment_invoice_id: string;
}

export interface OrderRouteUpdateInterface {
    id: string;
    customer_id?: string;
    products: [];
    order_status?: string;
    payment_status?: string;
    order_date?: Date;
    amount_to_pay?: number;
    customer_change?: string;
    o_amount_to_pay?: number;
    has_over_payment?: number;
    payment_remarks?: string;
    payment_balance?: number;
    payment_amount?: number;
    account_balance?: number;
    over_payment?: number;
    payment_invoice_id?: string;
}

export interface OrderRouteDeleteInterface {
    id: string;
}
