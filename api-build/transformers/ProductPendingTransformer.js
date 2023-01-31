"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProductPendingTransformRestorePayload = exports.useProductPendingTransformApprovalPayload = exports.useProductPendingTransformDeletePayload = exports.useProductPendingTransformUpdatePayload = exports.useProductPendingTransformCreatePayload = exports.useProductPendingTransformPayload = void 0;
const typeorm_1 = require("typeorm");
exports.useProductPendingTransformPayload = (request) => {
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
exports.useProductPendingTransformCreatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { request_by: userData.userName, event_request: 'Add', request_date: new Date() });
};
exports.useProductPendingTransformUpdatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { request_by: userData.userName, event_request: 'Modify', request_date: new Date() });
};
exports.useProductPendingTransformDeletePayload = (userData) => {
    return {
        request_by: userData.userName,
        event_request: 'Delete',
        request_date: new Date()
    };
};
exports.useProductPendingTransformApprovalPayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { request_by: userData.userName, event_request: request.event_request, request_date: new Date() });
};
exports.useProductPendingTransformRestorePayload = (userData) => {
    return {
        request_by: userData.id,
        event_request: 'Recover',
        request_date: new Date()
    };
};
//# sourceMappingURL=ProductPendingTransformer.js.map