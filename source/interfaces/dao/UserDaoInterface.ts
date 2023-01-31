import { CommonCreateDaoInterface, CommonDaoInterface, CommonDeleteDaoInterface, CommonUpdateDaoInterface } from './Common';

export interface UserDaoInterface extends CommonDaoInterface {
    name: string;
    username: string;
    password: string;
    type?: string;
    address: string;
    contact_number: string;
    role_id: string;
}

export interface UserDaoCreateInterface extends CommonCreateDaoInterface {
    name: string;
    username: string;
    password: string;
    type?: string;
    address: string;
    contact_number: string;
    role_id: string;
}

export interface UserDaoUpdateInterface extends CommonUpdateDaoInterface {
    name?: string;
    username?: string;
    password?: string;
    type?: string;
    address?: string;
    contact_number?: string;
    role_id?: string;
}

export interface UserDaoDeleteInterface extends CommonDeleteDaoInterface {}

export interface UserDaoResetPasswordInterface extends CommonUpdateDaoInterface {
    password: string;
}
