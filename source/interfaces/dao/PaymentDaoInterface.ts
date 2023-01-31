import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface PaymentDaoInterface extends CommonDaoInterface {
    payment_order_id: string;
    payment_amount: number;
    payment_date: Date;
    fully_paid: string;
    paid: string;
    payment_balance: number;
    account_balance: number;
    over_payment: number;
    recent: string;
    customer_status: string;
}

export interface PaymentDaoCreateInterface extends CommonCreateDaoInterface {
    payment_date: Date;
    order_status: string;
    payment_status: string;
    order_id: string;
    customer_id: string;
    status: string;
    payment_invoice_id: string;
    payment_amount: number;
    payment_balance: number;
    account_balance: number;
    over_payment: number;
    customer_payment_status: string;
    customer_status: string;
    recent: string;
    previous_over_payment: number;
    description: string;
}

export interface PaymentDaoUpdateInterface extends CommonUpdateDaoInterface {
    payment_date?: Date;
    order_status?: string;
    payment_status?: string;
    customer_id?: string;
    order_id?: string;
    status?: string;
    payment_invoice_id?: string;
    payment_amount?: number;
    payment_balance?: number;
    account_balance?: number;
    over_payment?: number;
    customer_payment_status?: string;
    customer_status?: string;
    recent?: string;
}

export interface PaymentDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface PaymentDaoRestoreInterface extends CommonRestoreDaoInterface {}
