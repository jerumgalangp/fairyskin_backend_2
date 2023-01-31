"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSchemaAndTableName = void 0;
const config_1 = require("../config/config");
exports.useSchemaAndTableName = (tableName) => `${config_1.ORM_DB_SCHEMA}.${tableName}`;
//# sourceMappingURL=Schema.js.map