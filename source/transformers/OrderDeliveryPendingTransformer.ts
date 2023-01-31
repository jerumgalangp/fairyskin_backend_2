import { OrderDeliveryPendingDaoUpdateInterface } from 'source/interfaces/dao/OrderDeliveryPendingDaoInterface';
import { ILike, In } from 'typeorm';
import { OrderDeliveryPendingRouteInterface, OrderDeliveryPendingRouteUpdateInterface } from '../interfaces/routes/OrderDeliveryPendingRouteInterface';
import { OrderDeliveryPendingDaoApprovalInterface } from './../interfaces/dao/OrderDeliveryPendingDaoInterface';
import { OrderDeliveryPendingRouteApprovalInterface } from './../interfaces/routes/OrderDeliveryPendingRouteInterface';

export const useOrderDeliveryPendingTransformPayload = (request: OrderDeliveryPendingRouteInterface): { [column: string]: any }[] => {
    const idColumns = ['id'];
    return Object.entries(request || {})
        .reduce(
            (accum, current) => {
                const [column, value] = current;
                if (!value) return accum;
                const argValue = () => {
                    if (!idColumns.includes(column)) return ILike(`%${value}%`);
                    if (value.constructor === Array) return In(value);
                    return value;
                };
                return [...accum, { [column]: argValue() }];
            },
            [{}]
        )
        .filter((data) => Object.keys(data).length > 0);
};

export const useOrderDeliveryPendingTransformUpdatePayload = (
    userData: { id: string; table: string; userName: string },
    request: OrderDeliveryPendingRouteUpdateInterface
): OrderDeliveryPendingDaoUpdateInterface => {
    return {
        ...request,
        request_by: userData.userName,
        event_request: 'Modify',
        request_date: new Date()
    };
};

export const useOrderDeliveryPendingTransformApprovalPayload = (
    userData: { id: string; table: string; userName: string },
    request: OrderDeliveryPendingRouteApprovalInterface
): OrderDeliveryPendingDaoApprovalInterface => {
    return {
        ...request,
        request_by: userData.userName,
        event_request: request.event_request,
        request_date: new Date()
    };
};
