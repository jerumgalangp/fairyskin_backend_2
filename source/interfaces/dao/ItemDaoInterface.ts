import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface ItemDaoInterface extends CommonDaoInterface {
    item_code: string;
    amount_mine: number;
    amount_grab: number;
    size_waist: string;
    size_length: string;
    size: string;
    details: string;
    item_category_id: string;
    buyer_id?: string;
    item_status_id: string;
}

export interface ItemDaoCreateInterface extends CommonCreateDaoInterface {
    item_code: string;
    amount_mine: number;
    amount_grab: number;
    size_waist?: string;
    size_length?: string;
    size?: string;
    details: string;
    item_category_id: string;
    item_status_id: string;
}

export interface ItemDaoUpdateInterface extends CommonUpdateDaoInterface {
    item_code?: string;
    amount_mine?: number;
    amount_grab?: number;
    size_waist?: string;
    size_length?: string;
    size?: string;
    details?: string;
    item_category_id?: string;
    item_status_id?: string;
}

export interface ItemDaoUpdateStatusInterface extends CommonUpdateDaoInterface {
    id: string[];
    status: string;
}

export interface ItemDaoDeleteInterface extends CommonDeleteDaoInterface {
    id: string[];
}

export interface ItemDaoRestoreInterface extends CommonRestoreDaoInterface {}
