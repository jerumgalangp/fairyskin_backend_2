"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOrderDeliveryPendingTransformApprovalPayload = exports.useOrderDeliveryPendingTransformUpdatePayload = exports.useOrderDeliveryPendingTransformPayload = void 0;
const typeorm_1 = require("typeorm");
exports.useOrderDeliveryPendingTransformPayload = (request) => {
    const idColumns = ['id'];
    return Object.entries(request || {})
        .reduce((accum, current) => {
        const [column, value] = current;
        if (!value)
            return accum;
        const argValue = () => {
            if (!idColumns.includes(column))
                return typeorm_1.ILike(`%${value}%`);
            if (value.constructor === Array)
                return typeorm_1.In(value);
            return value;
        };
        return [...accum, { [column]: argValue() }];
    }, [{}])
        .filter((data) => Object.keys(data).length > 0);
};
exports.useOrderDeliveryPendingTransformUpdatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { request_by: userData.userName, event_request: 'Modify', request_date: new Date() });
};
exports.useOrderDeliveryPendingTransformApprovalPayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { request_by: userData.userName, event_request: request.event_request, request_date: new Date() });
};
//# sourceMappingURL=OrderDeliveryPendingTransformer.js.map