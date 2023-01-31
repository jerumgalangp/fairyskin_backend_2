import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface RoleDaoInterface extends CommonDaoInterface {
    role_name: string;
    role_description: string;
    recipient?: string;
}

export interface RoleDaoCreateInterface extends CommonCreateDaoInterface {
    role_name: string;
    role_description: string;
    recipient?: string;
}

export interface RoleDaoUpdateInterface extends CommonUpdateDaoInterface {
    role_name?: string;
    role_description?: string;
    recipient?: string;
}

export interface RoleDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface RoleDaoRestoreInterface extends CommonRestoreDaoInterface {}
