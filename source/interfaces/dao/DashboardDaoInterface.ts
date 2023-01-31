import { CommonDaoInterface } from './Common';

export interface DashboardDaoInterface extends CommonDaoInterface {
    df?: string;
    dt?: string;
    p?: string;
    a?: string;
}
