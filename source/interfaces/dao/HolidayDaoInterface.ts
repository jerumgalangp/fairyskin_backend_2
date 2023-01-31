import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonRestoreDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface HolidayDaoInterface extends CommonDaoInterface {
    holiday_name: string;
    holiday_date: string;
}

export interface HolidayDaoCreateInterface extends CommonCreateDaoInterface {
    holiday_name: string;
    holiday_date: string;
}

export interface HolidayDaoUpdateInterface extends CommonUpdateDaoInterface {
    holiday_name?: string;
    holiday_date?: string;
}

export interface HolidayDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface HolidayDaoRestoreInterface extends CommonRestoreDaoInterface {}
