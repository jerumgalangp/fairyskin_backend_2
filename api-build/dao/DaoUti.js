"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQuery = void 0;
const typeorm_1 = require("typeorm");
const handleArgs = (query, where, andOr) => {
    const whereArgs = Object.entries(where);
    whereArgs.map((whereArg) => {
        const [fieldName, filters] = whereArg;
        const ops = Object.entries(filters);
        ops.map((parameters) => {
            const [operation, value] = parameters;
            switch (operation) {
                case 'is': {
                    query[andOr](`${fieldName} = :isvalue`, { isvalue: value });
                    break;
                }
                case 'not': {
                    query[andOr](`${fieldName} != :notvalue`, { notvalue: value });
                    break;
                }
                case 'in': {
                    query[andOr](`${fieldName} IN :invalue`, { invalue: value });
                    break;
                }
                case 'not_in': {
                    query[andOr](`${fieldName} NOT IN :notinvalue`, {
                        notinvalue: value
                    });
                    break;
                }
                case 'lt': {
                    query[andOr](`${fieldName} < :ltvalue`, { ltvalue: value });
                    break;
                }
                case 'lte': {
                    query[andOr](`${fieldName} <= :ltevalue`, { ltevalue: value });
                    break;
                }
                case 'gt': {
                    query[andOr](`${fieldName} > :gtvalue`, { gtvalue: value });
                    break;
                }
                case 'gte': {
                    query[andOr](`${fieldName} >= :gtevalue`, { gtevalue: value });
                    break;
                }
                case 'contains': {
                    query[andOr](`${fieldName} ILIKE :convalue`, {
                        convalue: `%${value}%`
                    });
                    break;
                }
                case 'not_contains': {
                    query[andOr](`${fieldName} NOT ILIKE :notconvalue`, {
                        notconvalue: `%${value}%`
                    });
                    break;
                }
                case 'starts_with': {
                    query[andOr](`${fieldName} ILIKE :swvalue`, {
                        swvalue: `${value}%`
                    });
                    break;
                }
                case 'not_starts_with': {
                    query[andOr](`${fieldName} NOT ILIKE :nswvalue`, {
                        nswvalue: `${value}%`
                    });
                    break;
                }
                case 'ends_with': {
                    query[andOr](`${fieldName} ILIKE :ewvalue`, {
                        ewvalue: `%${value}`
                    });
                    break;
                }
                case 'not_ends_with': {
                    query[andOr](`${fieldName} ILIKE :newvalue`, {
                        newvalue: `%${value}`
                    });
                    break;
                }
                default: {
                    break;
                }
            }
        });
    });
    return query;
};
exports.filterQuery = (query, where) => {
    if (!where) {
        return query;
    }
    Object.keys(where).forEach((key) => {
        if (key === 'OR') {
            query.andWhere(new typeorm_1.Brackets((qb) => where[key].map((queryArray) => {
                handleArgs(qb, queryArray, 'orWhere');
            })));
        }
        else if (key === 'AND') {
            query.andWhere(new typeorm_1.Brackets((qb) => where[key].map((queryArray) => {
                handleArgs(qb, queryArray, 'andWhere');
            })));
        }
    });
    return query;
};
//# sourceMappingURL=DaoUti.js.map