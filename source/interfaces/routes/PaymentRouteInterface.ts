export interface PaymentRouteInterface {
    id?: string | string[];
    payment_amount?: number;
    payment_date?: Date;
    order_status?: string;
    payment_status?: string;
    customer_id?: string;
    status?: string;
    payment_invoice_id?: string;
    payment_balance?: number;
    account_balance?: number;
    over_payment?: number;
    customer_status?: string;
    recent?: string;
}

export interface PaymentRouteCreateInterface {
    payment_amount: number;
    payment_date: Date;
    order_id: string;
    order_status: string;
    payment_status: string;
    customer_id: string;
    status: string;
    payment_invoice_id: string;
    payment_balance: number;
    account_balance: number;
    over_payment: number;
    customer_payment_status: string;
    customer_status: string;
    recent: string;
    previous_over_payment: number;
    description: string;
}

export interface PaymentRouteUpdateInterface {
    id: string;
    payment_amount?: number;
    payment_date?: Date;
    order_status?: string;
    payment_status?: string;
    order_id?: string;
    customer_id?: string;
    status?: string;
    payment_invoice_id?: string;
    payment_balance?: number;
    account_balance?: number;
    over_payment?: number;
    customer_payment_status?: string;
    customer_status?: string;
    recent?: string;
}

export interface PaymentRouteDeleteInterface {
    id: string;
}
