"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePaymentTransformRestorePayload = exports.usePaymentTransformDeletePayload = exports.usePaymentTransformUpdatePayload = exports.usePaymentTransformCreatePayload = exports.usePaymentHistoryTransformPayload = exports.usePaymentTransformPayload = void 0;
const typeorm_1 = require("typeorm");
exports.usePaymentTransformPayload = (request) => {
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
exports.usePaymentHistoryTransformPayload = (request) => {
    const idColumns = ['payment_invoice_id'];
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
exports.usePaymentTransformCreatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { created_by: userData.id });
};
exports.usePaymentTransformUpdatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { updated_by: userData.id });
};
exports.usePaymentTransformDeletePayload = (userData) => {
    return {
        deleted_by: userData.id
    };
};
exports.usePaymentTransformRestorePayload = (userData) => {
    return {
        updated_by: userData.id
    };
};
//# sourceMappingURL=PaymentTransformer.js.map