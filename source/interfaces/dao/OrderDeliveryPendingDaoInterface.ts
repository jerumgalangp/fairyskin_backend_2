import { CommonPendingApprovalDaoInterface, CommonPendingDaoInterface, CommonPendingUpdateDaoInterface } from './CommonPending';

export interface OrderDeliveryPendingDaoInterface extends CommonPendingDaoInterface {
    si_number?: string;
    remarks?: string;
    status?: string;
    products?: [];
    approval_ind?: string;
    reference_value?: string;
}

export interface OrderDeliveryPendingDaoUpdateInterface extends CommonPendingUpdateDaoInterface {
    si_number: string;
    remarks?: string;
    status?: string;
    products: [];
    approval_ind?: string;
    reference_value?: string;
    delivered_date: Date;
}

export interface OrderDeliveryPendingDaoApprovalInterface extends CommonPendingApprovalDaoInterface {
    id?: string;
    si_number?: string;
    remarks?: string;
    status?: string;
    products?: [];
    transaction_status: string;
    event_request: string;
    order_id: string;
    order_status: string;
    order_remarks: string;
    delivered_date: Date;
}
