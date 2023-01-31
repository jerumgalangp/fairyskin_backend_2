"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useItemTransformRestorePayload = exports.useItemTransformDeletePayload = exports.useItemStatusTransformUpdatePayload = exports.useItemTransformUpdatePayload = exports.useItemTransformCreatePayload = exports.useItemOptionsTransformPayload = exports.useItemTransformPayload = void 0;
const typeorm_1 = require("typeorm");
exports.useItemTransformPayload = (request) => {
    const idColumns = ['id'];
    return Object.entries(request || {})
        .reduce((accum, current) => {
        const [column, value] = current;
        if (!value)
            return accum;
        const argValue = () => {
            if (!idColumns.includes(column))
                return typeorm_1.Equal(`${value}`);
            if (value.constructor === Array)
                return typeorm_1.In(value);
            return value;
        };
        return [...accum, { [column]: argValue() }];
    }, [{}])
        .filter((data) => Object.keys(data).length > 0);
};
exports.useItemOptionsTransformPayload = (request) => {
    return {
        buyer_id: request.buyer_id
    };
};
exports.useItemTransformCreatePayload = (request) => {
    return Object.assign(Object.assign({}, request), { created_by: 'JERUM_CREATE' });
};
exports.useItemTransformUpdatePayload = (request) => {
    return Object.assign(Object.assign({}, request), { updated_by: 'JERUM_UPDATE' });
};
exports.useItemStatusTransformUpdatePayload = (request) => {
    return Object.assign(Object.assign({}, request), { updated_by: 'JERUM_UPDATE' });
};
exports.useItemTransformDeletePayload = (request) => {
    return Object.assign(Object.assign({}, request), { deleted_by: 'JERUM_DELETE', deleted_at: new Date() });
};
exports.useItemTransformRestorePayload = () => {
    return {
        updated_by: 'JERUM_UPDATE'
    };
};
//# sourceMappingURL=ItemTransformer.js.map