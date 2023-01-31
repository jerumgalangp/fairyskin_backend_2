"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultUserSuperAdmin1606995971032 = void 0;
const config_1 = require("../config/config");
const encryption_1 = require("../constant/encryption");
const Entities_1 = require("../constant/Entities");
const permissions_1 = require("../constant/permissions");
class defaultUserSuperAdmin1606995971032 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`INSERT INTO ` + `${config_1.ORM_DB_SCHEMA}."${Entities_1.Entities.ROLES}" (role_name,role_description) ` + `VALUES ` + `('${permissions_1.RoleType.SuperAdmin}', 'Super Administrator')`);
            yield queryRunner.query(`INSERT INTO ` +
                `${config_1.ORM_DB_SCHEMA}."${Entities_1.Entities.MENU}" (menu_name) ` +
                `VALUES ` +
                `('Dashboard'),
        ('Inventory View'),
        ('Inventory Request View'),
        ('Inventory Request Add'),
        ('Inventory Request Edit'),
        ('Inventory Request Delete'),
        ('Inventory Approval View'),
        ('Inventory Approval Approve'),
        ('Inventory Approval Reject'),
        ('Customer Maintenance View'),
        ('Customer Maintenance Add'),
        ('Customer Maintenance Edit'),
        ('Customer Maintenance Delete'),
        ('Order Maintenance View'),
        ('Order Maintenance Add'),
        ('Order Maintenance Edit'),
        ('Order Maintenance Delete'),
        ('Payment Maintenance View'),
        ('Payment Maintenance Add'),
        ('Payment Maintenance Edit'),
        ('Payment Maintenance Delete'),
        ('Invoice Request View'),
        ('Invoice Request Add'),
        ('Invoice Request Edit'),
        ('Invoice Request Delete'),
        ('Invoice Approval View'),
        ('Invoice Approval Approve'),
        ('Invoice Approval Reject'),
        ('Tracking Maintenance View'),
        ('Tracking Maintenance Add'),
        ('Tracking Maintenance Edit'),
        ('Tracking Maintenance Delete'),
        ('User Maintenance View'),
        ('User Maintenance Add'),
        ('User Maintenance Edit'),
        ('User Maintenance Delete'),
        ('Role & Menu Maintenance View'),
        ('Role & Menu Maintenance Add'),
        ('Role & Menu Maintenance Edit'),
        ('Role & Menu Maintenance Delete'),
        ('Financial Maintenance View'),
        ('Reports')
        `);
            const superAdminData = yield queryRunner.query(`SELECT ` + `id ` + `FROM ` + `${config_1.ORM_DB_SCHEMA}."${Entities_1.Entities.ROLES}" ` + `WHERE ` + `role_name = '${permissions_1.RoleType.SuperAdmin}'`);
            const { id: superAdminId } = superAdminData[0];
            yield queryRunner.query(`INSERT INTO ` +
                `${config_1.ORM_DB_SCHEMA}."${Entities_1.Entities.USER}" (${permissions_1.DEFAULT_SUPER_ADMIN_COLUMNS.join()}) ` +
                `VALUES ` +
                `(${permissions_1.DEFAULT_SUPER_ADMIN_VALUES.join()}, '${yield encryption_1.useHash('a')}', '${superAdminId}')`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const superAdminUserData = yield queryRunner.query(`SELECT ` + `id ` + `FROM ` + `${config_1.ORM_DB_SCHEMA}."${Entities_1.Entities.USER}" ` + `ORDER BY ` + `created_at ` + `ASC LIMIT 1 `);
            const { id: superAdminUserId } = superAdminUserData[0];
            yield queryRunner.query(`DELETE ` + `FROM ` + `${config_1.ORM_DB_SCHEMA}."${Entities_1.Entities.USER}" ` + `WHERE ` + `id = '${superAdminUserId}'`);
            yield queryRunner.query(`TRUNCATE TABLE ${config_1.ORM_DB_SCHEMA}."${Entities_1.Entities.ROLES}" CASCADE`);
        });
    }
}
exports.defaultUserSuperAdmin1606995971032 = defaultUserSuperAdmin1606995971032;
//# sourceMappingURL=1606995971032-default_user_super_admin.js.map