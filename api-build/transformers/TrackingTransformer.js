"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTrackingTransformRestorePayload = exports.useTrackingTransformDeletePayload = exports.useTrackingTransformUpdatePayload = exports.useTrackingTransformCreatePayload = exports.useTrackingDeliverProductTransformPayload = exports.useTrackingProductTransformPayload = exports.useOrderDistributedTransformPayload = exports.useTrackingTransformPayload = exports.useOrderTrackingTransformPayload = void 0;
const typeorm_1 = require("typeorm");
exports.useOrderTrackingTransformPayload = (request) => {
    const idColumns = ['customer_name'];
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
exports.useTrackingTransformPayload = (request) => {
    const idColumns = ['Tracking_status'];
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
exports.useOrderDistributedTransformPayload = (request) => {
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
exports.useTrackingProductTransformPayload = (request) => {
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
exports.useTrackingDeliverProductTransformPayload = (request) => {
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
exports.useTrackingTransformCreatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { created_by: userData.id });
};
exports.useTrackingTransformUpdatePayload = (userData, request) => {
    return Object.assign(Object.assign({}, request), { updated_by: userData.id });
};
exports.useTrackingTransformDeletePayload = (userData) => {
    return {
        deleted_by: userData.id
    };
};
exports.useTrackingTransformRestorePayload = (userData) => {
    return {
        updated_by: userData.id
    };
};
//# sourceMappingURL=TrackingTransformer.js.map