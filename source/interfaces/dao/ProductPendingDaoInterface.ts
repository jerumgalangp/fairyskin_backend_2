import {
    CommonPendingApprovalDaoInterface,
    CommonPendingCreateDaoInterface,
    CommonPendingDaoInterface,
    CommonPendingDeleteDaoInterface,
    CommonPendingRestoreDaoInterface,
    CommonPendingUpdateDaoInterface
} from './CommonPending';

export interface ProductPendingDaoInterface extends CommonPendingDaoInterface {
    id: string;
    product_code: string;
    product_name: string;
    quantity: number;
    ordered_quantity: number;
    forecasted_quantity: number;
    approval_ind: string;
    reference_value: string;
}

export interface ProductPendingDaoCreateInterface extends CommonPendingCreateDaoInterface {
    product_code: string;
    product_name: string;
    quantity: number;
    ordered_quantity: number;
    forecasted_quantity: number;
    approval_ind: string;
    reference_value: string;
}

export interface ProductPendingDaoUpdateInterface extends CommonPendingUpdateDaoInterface {
    product_code: string;
    product_name: string;
    quantity?: number;
    ordered_quantity?: number;
    forecasted_quantity?: number;
    approval_ind?: string;
    reference_value?: string;
}

export interface ProductPendingDaoApprovalInterface extends CommonPendingApprovalDaoInterface {
    id?: string;
    product_code?: string;
    product_name?: string;
    quantity: number;
    ordered_quantity?: number;
    forecasted_quantity?: number;
    approval_ind?: string;
    reference_value?: string;
    status: string;
    event_request: string;
}

export interface ProductPendingDaoDeleteInterface extends CommonPendingDeleteDaoInterface {}

export interface ProductPendingDaoRestoreInterface extends CommonPendingRestoreDaoInterface {}
