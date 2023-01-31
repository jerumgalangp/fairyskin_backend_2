import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface ProductDaoInterface extends CommonDaoInterface {
    product_code: string;
    product_name: string;
    quantity: number;
    ordered_quantity: number;
    forecasted_quantity: number;
    approval_ind: string;
}

export interface ProductDaoCreateInterface extends CommonCreateDaoInterface {
    product_code: string;
    product_name: string;
    quantity: number;
    ordered_quantity: number;
    forecasted_quantity: number;
    approval_ind: string;
    reference_value: string;
}

export interface ProductDaoUpdateInterface extends CommonUpdateDaoInterface {
    product_code?: string;
    product_name?: string;
    quantity?: number;
    ordered_quantity?: number;
    forecasted_quantity?: number;
    approval_ind?: string;
    reference_value?: string;
}

export interface ProductDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface ProductDaoRestoreInterface extends CommonRestoreDaoInterface {}
