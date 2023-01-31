export interface CommonDaoInterface extends CommonCreateDaoInterface, CommonUpdateDaoInterface, CommonDeleteDaoInterface {
    id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export interface CommonCreateDaoInterface {
    created_by: string;
}

export interface CommonUpdateDaoInterface {
    updated_by: string;
}

export interface CommonDeleteDaoInterface {
    deleted_by: string;
}

export interface CommonRestoreDaoInterface {
    updated_by: string;
}
