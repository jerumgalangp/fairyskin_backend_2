"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReportTransformPayload = void 0;
const typeorm_1 = require("typeorm");
exports.useReportTransformPayload = (request) => {
    const idColumns = ['id'];
    return Object.entries(request || {})
        .reduce((accum, current) => {
        const [column, value] = current;
        if (!value)
            return accum;
        const argValue = () => {
            if (!idColumns.includes(column))
                return typeorm_1.ILike(`${value}`);
            if (value.constructor === Array)
                return typeorm_1.In(value);
            return value;
        };
        return [...accum, { [column]: argValue() }];
    }, [{}])
        .filter((data) => Object.keys(data).length > 0);
};
//# sourceMappingURL=ReportTransformer.js.map