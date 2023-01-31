import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface PersonnelDaoInterface extends CommonDaoInterface {
    personnel_name: string;
    contact_number: string;
}

export interface PersonnelDaoCreateInterface extends CommonCreateDaoInterface {
    personnel_name: string;
    contact_number: string;
}

export interface PersonnelDaoUpdateInterface extends CommonUpdateDaoInterface {
    personnel_name?: string;
    contact_number?: string;
}

export interface PersonnelDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface PersonnelDaoRestoreInterface extends CommonRestoreDaoInterface {}
