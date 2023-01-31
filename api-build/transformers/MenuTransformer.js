"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMenuTransformRestorePayload = exports.useMenuTransformDeletePayload = exports.useMenuTransformUpdatePayload = exports.useMenuTransformCreatePayload = exports.useMenuTransformPayload = void 0;
const typeorm_1 = require("typeorm");
exports.useMenuTransformPayload = (request) => {
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
exports.useMenuTransformCreatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { created_by: userData.id });
};
exports.useMenuTransformUpdatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { updated_by: userData.id });
};
exports.useMenuTransformDeletePayload = (userData) => {
    return {
        deleted_by: userData.id
    };
};
exports.useMenuTransformRestorePayload = (userData) => {
    return {
        updated_by: userData.id
    };
};
//# sourceMappingURL=MenuTransformer.js.map