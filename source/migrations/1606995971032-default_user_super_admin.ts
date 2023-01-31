import { MigrationInterface, QueryRunner } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { useHash } from '../constant/encryption';
import { Entities } from '../constant/Entities';
import { DEFAULT_SUPER_ADMIN_COLUMNS, DEFAULT_SUPER_ADMIN_VALUES, RoleType } from '../constant/permissions';

export class defaultUserSuperAdmin1606995971032 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        /* Creation of Roles */
        // await queryRunner.query(
        //     `INSERT INTO ` +
        //         `${ORM_DB_SCHEMA}."${Entities.ROLES}" (role_name,role_description) ` +
        //         `VALUES ` +
        //         `('${RoleType.SuperAdmin}', 'Super Administrator')` +
        //         `('${RoleType.InventoryAdmin}', 'Inventory Administrator'),` +
        //         `('${RoleType.OrderAdmin}', 'Order Administrator'),` +
        //         `('${RoleType.WareHouseAdmin}', 'Warehouse Administrator'),` +
        //         `('${RoleType.LogisticAdmin}', 'Logistics Administrator'),` +
        //         `('${RoleType.FinanceAdmin}', 'Finance Administrator'),` +
        //         `('${RoleType.RegionalDist}', 'Regional Distributor'),` +
        //         `('${RoleType.ProvincialDist}', 'Provincial Distributor'),` +
        //         `('${RoleType.DistrictDist}', 'District Distributor'),` +
        //         `('${RoleType.CityDist}', 'City Distributor'),` +
        //         `('${RoleType.DealerDist}', 'Dealer Distributor'),` +
        //         `('${RoleType.InternationalFranchise}', 'International Franchisee'),` +
        //         `('${RoleType.InternationalDist}', 'International Distributor'),` +
        //         `('${RoleType.InternationalStockHist}', 'International Stockhist'),` +
        //         `('${RoleType.InternationalSubStockHist}', 'International Sub Stockhist'),` +
        //         `('${RoleType.InternationalReseller}', 'International Reseller')`
        // );

        await queryRunner.query(`INSERT INTO ` + `${ORM_DB_SCHEMA}."${Entities.ROLES}" (role_name,role_description) ` + `VALUES ` + `('${RoleType.SuperAdmin}', 'Super Administrator')`);

        //INSERT MENU LIST
        await queryRunner.query(
            `INSERT INTO ` +
                `${ORM_DB_SCHEMA}."${Entities.MENU}" (menu_name) ` +
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
        `
        );

        //const menus = await queryRunner.query(`SELECT ` + `id` + `FROM ` + `${ORM_DB_SCHEMA}."${Entities.MENU}" `);
        //$argon2id$v=19$m=4096,t=3,p=1$RqLzFy6I4gPM7xUURQK+Gw$0PN87rwknZcfSJfmAFrS+mMYNfrbUXfAXrW2d+vi1Ks
        /* Super Admin Type ID */
        const superAdminData = await queryRunner.query(`SELECT ` + `id ` + `FROM ` + `${ORM_DB_SCHEMA}."${Entities.ROLES}" ` + `WHERE ` + `role_name = '${RoleType.SuperAdmin}'`);
        const { id: superAdminId } = superAdminData[0];

        /* Creation of Super Admin User */
        await queryRunner.query(
            `INSERT INTO ` +
                `${ORM_DB_SCHEMA}."${Entities.USER}" (${DEFAULT_SUPER_ADMIN_COLUMNS.join()}) ` +
                `VALUES ` +
                `(${DEFAULT_SUPER_ADMIN_VALUES.join()}, '${await useHash('a')}', '${superAdminId}')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const superAdminUserData = await queryRunner.query(`SELECT ` + `id ` + `FROM ` + `${ORM_DB_SCHEMA}."${Entities.USER}" ` + `ORDER BY ` + `created_at ` + `ASC LIMIT 1 `);

        const { id: superAdminUserId } = superAdminUserData[0];

        await queryRunner.query(`DELETE ` + `FROM ` + `${ORM_DB_SCHEMA}."${Entities.USER}" ` + `WHERE ` + `id = '${superAdminUserId}'`);
        await queryRunner.query(`TRUNCATE TABLE ${ORM_DB_SCHEMA}."${Entities.ROLES}" CASCADE`);
    }
}
