import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface TrackingDaoInterface extends CommonDaoInterface {
    tracking_name: string;
    tracking_reference_number: string;
    tracking_customer_id: string;
    tracking_amount: string;
    tracking_due_date: string;
    tracking_filename: string;
    tracking_filepath: string;
    tracking_document_no: string;
    tracking_fully_paid_date: string;
    tracking_paid_amount: string;
    tracking_last_payment_amount: string;
    tracking_process_date: string;
    customer_name?: string;
}

export interface TrackingDaoCreateInterface extends CommonCreateDaoInterface {
    si_number: string;
    customer_id: string;
    order_id: string;
    products: [];
    date_distributed: Date;
    reference_value?: string;
    user_id: string;
    distributed_quantity: number;
}

export interface TrackingDaoUpdateInterface extends CommonUpdateDaoInterface {
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

export interface TrackingDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface TrackingDaoRestoreInterface extends CommonRestoreDaoInterface {}
