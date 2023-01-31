import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface OrderDaoInterface extends CommonDaoInterface {
    order_name: string;
    order_reference_number: string;
    order_customer_id: string;
    order_amount: string;
    order_due_date: string;
    order_filename: string;
    order_filepath: string;
    order_document_no: string;
    order_fully_paid_date: string;
    order_paid_amount: string;
    order_last_payment_amount: string;
    order_process_date: string;
}

export interface OrderDaoCreateInterface extends CommonCreateDaoInterface {
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

export interface OrderDaoUpdateInterface extends CommonUpdateDaoInterface {
    si_number?: string;
    customer_id?: string;
    products: [];
    order_status?: string;
    payment_status?: string;
    order_date?: Date;
    customer_change?: string;
    amount_to_pay?: number;
    o_amount_to_pay?: number;
    has_over_payment?: number;
    payment_remarks?: string;
    payment_balance?: number;
    payment_amount?: number;
    account_balance?: number;
    over_payment?: number;
    payment_invoice_id?: string;
}

export interface OrderDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface OrderDaoRestoreInterface extends CommonRestoreDaoInterface {}
