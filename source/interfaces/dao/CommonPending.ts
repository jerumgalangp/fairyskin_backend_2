export interface CommonPendingDaoInterface extends CommonPendingCreateDaoInterface, CommonPendingUpdateDaoInterface, CommonPendingDeleteDaoInterface {
    id: string;
    request_date: Date;
}

export interface CommonPendingCreateDaoInterface {
    request_by: string;
    event_request: string;
    request_date: Date;
}

export interface CommonPendingUpdateDaoInterface {
    request_by: string;
    event_request: string;
    request_date: Date;
}

export interface CommonPendingDeleteDaoInterface {
    request_by: string;
    event_request: string;
    request_date: Date;
}

export interface CommonPendingRestoreDaoInterface {
    request_by: string;
    event_request: string;
    request_date: Date;
}

export interface CommonPendingApprovalDaoInterface {
    request_by: string;
    event_request: string;
    request_date: Date;
}
