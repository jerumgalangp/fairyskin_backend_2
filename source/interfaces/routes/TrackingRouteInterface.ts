export interface TrackingRouteInterface {
    id?: string | string[];
    tracking_name?: string;
    tracking_reference_number?: string;
    tracking_customer_id?: string | [];
    tracking_amount?: string;
    tracking_due_date?: string;
    tracking_filename?: string;
    tracking_filepath?: string;
    tracking_document_no?: string;
    tracking_fully_paid_date?: string;
    tracking_paid_amount?: string;
    tracking_last_payment_amount?: string;
    tracking_process_date?: string;
    df?: string;
    dt?: string;
    from_report?: string;
    tracking_status?: string;
    customer_name?: string;
}

export interface TrackingRouteCreateInterface {
    si_number: string;
    customer_id: string;
    order_id: string;
    products: [];
    date_distributed: Date;
    reference_value?: string;
    user_id: string;
    distributed_quantity: number;
}

export interface TrackingRouteUpdateInterface {
    id: string;
    si_number?: string;
    customer_id?: string;
    order_id?: string;
    products?: [];
    product_id?: string;
    date_distributed?: Date;
    reference_value?: string;
    user_id?: string;
    distributed_quantity: number;
    original_quantity: number;
}

export interface TrackingRouteDeleteInterface {
    id: string;
}
