"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInvoiceTransformRestorePayload = exports.useInvoiceTransformDeletePayload = exports.useInvoiceTransformUpdatePayload = exports.useInvoiceTransformCreatePayload = exports.useInvoiceTransformPayload = void 0;
const typeorm_1 = require("typeorm");
exports.useInvoiceTransformPayload = (request) => {
    const idColumns = ['invoice_code'];
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
exports.useInvoiceTransformCreatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { created_by: userData.id });
};
exports.useInvoiceTransformUpdatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { updated_by: userData.id });
};
exports.useInvoiceTransformDeletePayload = (userData) => {
    return {
        deleted_by: userData.id
    };
};
exports.useInvoiceTransformRestorePayload = (userData) => {
    return {
        updated_by: userData.id
    };
};
//# sourceMappingURL=InvoiceTransformer.js.map