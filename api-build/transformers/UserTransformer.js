"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserTransformResetPasswordPayload = exports.useUserTransformDeletePayload = exports.useUserTransformUpdatePayload = exports.useUserTransformCreatePayload = exports.useUserTransformPayload2 = exports.useUserTransformPayload = void 0;
const typeorm_1 = require("typeorm");
exports.useUserTransformPayload = (request) => {
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
exports.useUserTransformPayload2 = (request) => {
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
exports.useUserTransformCreatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { created_by: userData.id });
};
exports.useUserTransformUpdatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { updated_by: userData.id });
};
exports.useUserTransformDeletePayload = (userData) => {
    return {
        deleted_by: userData.id
    };
};
exports.useUserTransformResetPasswordPayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { updated_by: userData.id });
};
//# sourceMappingURL=UserTransformer.js.map