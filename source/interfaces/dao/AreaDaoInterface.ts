import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface AreaDaoInterface extends CommonDaoInterface {
    area_name: string;
}

export interface AreaDaoCreateInterface extends CommonCreateDaoInterface {
    area_name: string;
}

export interface AreaDaoUpdateInterface extends CommonUpdateDaoInterface {
    area_name?: string;
}

export interface AreaDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface AreaDaoRestoreInterface extends CommonRestoreDaoInterface {}
