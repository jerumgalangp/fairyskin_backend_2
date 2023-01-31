import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface ParameterDaoInterface extends CommonDaoInterface {
    parameter_type: string;
    parameter_name: string;
    parameter_value: string;
}

export interface ParameterDaoCreateInterface extends CommonCreateDaoInterface {
    parameter_type: string;
    parameter_name: string;
    parameter_value: string;
}

export interface ParameterDaoUpdateInterface extends CommonUpdateDaoInterface {
    parameter_type?: string;
    parameter_name?: string;
    parameter_value?: string;
}

export interface ParameterDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface ParameterDaoRestoreInterface extends CommonRestoreDaoInterface {}
