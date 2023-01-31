import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface MenuDaoInterface extends CommonDaoInterface {
    menu_name: string;
    role_id: string;
}

export interface MenuDaoCreateInterface extends CommonCreateDaoInterface {
    menu_name: string;
    role_id: string;
}

export interface MenuDaoUpdateInterface extends CommonUpdateDaoInterface {
    menu_name?: string[];
    role_id?: string;
}

export interface MenuDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface MenuDaoRestoreInterface extends CommonRestoreDaoInterface {}
