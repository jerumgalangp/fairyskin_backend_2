"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTransformPaginationPayload = void 0;
exports.useTransformPaginationPayload = (headers) => {
    if (!headers.current || !headers.pagesize)
        return { skip: 0, current: 1, take: 20 };
    return {
        skip: (Number(headers.current) - 1) * Number(headers.pagesize),
        current: Number(headers.current),
        take: Number(headers.pagesize)
    };
};
//# sourceMappingURL=Pagination.js.map