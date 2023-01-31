import { PaginationRequestRouteInterface } from './PaginationRoutesInterface';
export interface HttpResponseRouteInterface {
    message: string;
    statusCode: number;
    code: number;
    session?: any;
    results?: any;
    token?: string | null;
    pagingation?: {
        total: number;
        page: number;
    };
    id?: string;
}

export interface HeadersRouteInterface extends PaginationRequestRouteInterface {
    filters?: string;
    withdeleted?: string;
    sort?: string;
    sort_by?: string;
}
