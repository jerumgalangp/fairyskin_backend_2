export interface EWTRouteInterface {
    id?: string | string[];
    ewt_amount?: string;
    ewt_due_date?: string;
    ewt_collected_date?: string;
    payment_ewt_percentage?: string;
    payment_ewt_data_id?: string | [];
    ewt_personnel_id?: string | [];
    df?: string;
    dt?: string;
    from_report?: string;
}

export interface EWTRouteCreateInterface {
    ewt_reference_number: string;
    ewt_amount: string;
    ewt_due_date: string;
    ewt_collected_date: string;
    payment_ewt_percentage: string;
    ewt_personnel_id: string;
    ewt_payment_id: string;
}

export interface EWTRouteUpdateInterface {
    id: string;
    ewt_reference_number?: string;
    ewt_amount?: string;
    ewt_due_date?: string;
    ewt_collected_date?: string;
    payment_ewt_percentage?: string;
    ewt_personnel_id?: string;
    ewt_payment_id?: string;
}

export interface EWTRouteDeleteInterface {
    id: string;
}
