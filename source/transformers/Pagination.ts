import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';

export const useTransformPaginationPayload = (headers: HeadersRouteInterface): PaginationDaoInterface => {
    // console.log('headers=============', headers);
    // console.log('headers.current=============', headers.current);
    // console.log('headers.pagesize=============', headers.pagesize);

    if (!headers.current || !headers.pagesize) return { skip: 0, current: 1, take: 20 };

    return {
        skip: (Number(headers.current) - 1) * Number(headers.pagesize),
        current: Number(headers.current),
        take: Number(headers.pagesize)
    };
};
