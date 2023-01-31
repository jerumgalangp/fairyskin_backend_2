import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface InvoiceDaoInterface extends CommonDaoInterface {
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
    df: string;
    dt: string;
}

export interface InvoiceDaoCreateInterface extends CommonCreateDaoInterface {
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

export interface InvoiceDaoUpdateInterface extends CommonUpdateDaoInterface {
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

export interface InvoiceDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface InvoiceDaoRestoreInterface extends CommonRestoreDaoInterface {}
