import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface EWTDaoInterface extends CommonDaoInterface {
    ewt_reference_number: string;
    ewt_amount: string;
    ewt_due_date: string;
    ewt_collected_date: string;
    payment_ewt_percentage: string;
    ewt_personnel_id: string;
    ewt_payment_id: string;
}

export interface EWTDaoCreateInterface extends CommonCreateDaoInterface {
    ewt_reference_number: string;
    ewt_amount: string;
    ewt_due_date: string;
    ewt_collected_date: string;
    payment_ewt_percentage: string;
    ewt_personnel_id: string;
    ewt_payment_id: string;
}

export interface EWTDaoUpdateInterface extends CommonUpdateDaoInterface {
    ewt_reference_number?: string;
    ewt_amount?: string;
    ewt_due_date?: string;
    ewt_collected_date?: string;
    payment_ewt_percentage?: string;
    ewt_personnel_id?: string;
    ewt_payment_id?: string;
}

export interface EWTDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface EWTDaoRestoreInterface extends CommonRestoreDaoInterface {}
