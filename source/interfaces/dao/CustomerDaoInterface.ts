import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface CustomerDaoInterface extends CommonDaoInterface {
    customer_name: string;
    customer_reference_number: string;
    personnel_id: string;
    customer_address: string;
    customer_contact_number: string;
    customer_email: string;
    customer_fax: string;
    customer_contact_person: string;
    customer_terms: string;
    customer_order_document_type: string;
    customer_zero_rated: string;
    customer_collection_date: string;
    customer_collection_time: string;
    customer_collection_area: string;
    customer_collection_contact_number: string;
    payment_sequence: number;
    all_available: string;
    customer_area: string;
    customer_team: string;
}

export interface CustomerDaoCreateInterface extends CommonCreateDaoInterface {
    customer_email: string;
    user_id: string;
    payment_sequence: number;
    customer_area: string;
    customer_team: string;
}

export interface CustomerDaoUpdateInterface extends CommonUpdateDaoInterface {
    customer_name?: string;
    customer_reference_number?: string;
    personnel_id?: string;
    customer_address?: string;
    customer_contact_number?: string;
    customer_email?: string;
    customer_fax?: string;
    customer_contact_person?: string;
    customer_terms?: string;
    customer_order_document_type?: string;
    customer_zero_rated?: string;
    customer_collection_date?: string;
    customer_collection_time?: string;
    customer_collection_area?: string;
    customer_collection_contact_number?: string;
    payment_sequence?: number;
    customer_area?: string;
    customer_team?: string;
}

export interface CustomerDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface CustomerDaoRestoreInterface extends CommonRestoreDaoInterface {}
