"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SUPER_ADMIN_VALUES = exports.DEFAULT_SUPER_ADMIN_COLUMNS = exports.DEFAULT_PERMISSIONS = exports.RoleType = void 0;
var RoleType;
(function (RoleType) {
    RoleType["SuperAdmin"] = "super_admin";
    RoleType["InventoryAdmin"] = "inventory_admin";
    RoleType["OrderAdmin"] = "order_admin";
    RoleType["WareHouseAdmin"] = "warehouse_admin";
    RoleType["LogisticAdmin"] = "logistics_admin";
    RoleType["FinanceAdmin"] = "finance_admin";
    RoleType["RegionalDist"] = "regional_distributor";
    RoleType["ProvincialDist"] = "provincial_distributor";
    RoleType["DistrictDist"] = "district_distributor";
    RoleType["CityDist"] = "city_distributor";
    RoleType["DealerDist"] = "dealer_distributor";
    RoleType["InternationalFranchise"] = "international_franchise";
    RoleType["InternationalDist"] = "international_distributor";
    RoleType["InternationalStockHist"] = "international_stockhist";
    RoleType["InternationalSubStockHist"] = "international_sub_stockhist";
    RoleType["InternationalReseller"] = "international_reseller";
})(RoleType = exports.RoleType || (exports.RoleType = {}));
exports.DEFAULT_PERMISSIONS = {
    super_admin: {
        productsManagement: {
            products: 'CRUD',
            variants: 'CRUD'
        },
        productTypeManagement: {
            categories: 'CRUD',
            brands: 'CRUD',
            suppliers: 'CRUD',
            departments: 'CRUD'
        },
        warehouseManagement: {
            warehouseLocations: 'CRUD',
            displayLocations: 'CRUD',
            warehouse: 'CRUD',
            aisles: 'CRUD',
            racks: 'CRUD',
            pallets: 'CRUD',
            crates: 'CRUD',
            phases: 'CRUD',
            levels: 'CRUD'
        },
        inventoryManagement: 'CRUD',
        inboundManagement: {
            stockTransfers: 'CRUD',
            purchaseOrders: 'CRUD',
            ntds: 'CRUD',
            inboundTransaction: 'CRUD',
            staging: 'CRUD'
        },
        outboundManagement: {
            purchaseOrders: 'CRUD',
            mfcRequests: 'CRUD',
            salesOrders: 'CRUD',
            stockTransferOrders: 'CRUD',
            outboundTransactions: 'CRUD',
            pickings: 'CRUD',
            dispatchs: 'CRUD'
        },
        skuManagement: 'CRUD',
        deviceManagement: 'CRUD',
        announcementManagement: 'CRUD',
        reportsManagement: 'CRUD',
        userManagement: 'CRUD',
        userPermissionsManagement: 'CRUD',
        clientManagement: 'CRUD',
        courierManagement: 'CRUD',
        systemLogs: 'CRUD'
    },
    admin: {
        productsManagement: {
            products: 'CRUD',
            variants: 'CRUD'
        },
        productTypeManagement: {
            categories: 'CRUD',
            brands: 'CRUD',
            suppliers: 'CRUD',
            departments: 'CRUD'
        },
        warehouseManagement: {
            warehouseLocations: 'CRUD',
            displayLocations: 'CRUD',
            warehouse: 'CRUD',
            aisles: 'CRUD',
            racks: 'CRUD',
            pallets: 'CRUD',
            crates: 'CRUD',
            phases: 'CRUD',
            levels: 'CRUD'
        },
        inventoryManagement: 'CRUD',
        inboundManagement: {
            stockTransfers: 'CRUD',
            purchaseOrders: 'CRUD',
            ntds: 'CRUD',
            inboundTransaction: 'CRUD',
            staging: 'CRUD'
        },
        outboundManagement: {
            purchaseOrders: 'CRUD',
            mfcRequests: 'CRUD',
            salesOrders: 'CRUD',
            stockTransferOrders: 'CRUD',
            outboundTransactions: 'CRUD',
            pickings: 'CRUD',
            dispatchs: 'CRUD'
        },
        skuManagement: 'CRUD',
        deviceManagement: 'CRUD',
        announcementManagement: 'CRUD',
        reportsManagement: 'CRUD',
        userManagement: 'CRUD',
        userPermissionsManagement: 'CRUD',
        clientManagement: 'CRUD',
        courierManagement: 'CRUD',
        systemLogs: 'CRUD'
    },
    manager: {
        productsManagement: {
            products: 'CRUD',
            variants: 'CRUD'
        },
        productTypeManagement: {
            categories: 'CRUD',
            brands: 'CRUD',
            suppliers: 'CRUD',
            departments: 'CRUD'
        },
        warehouseManagement: {
            warehouseLocations: 'CRUD',
            displayLocations: 'CRUD',
            warehouse: 'CRUD',
            aisles: 'CRUD',
            racks: 'CRUD',
            pallets: 'CRUD',
            crates: 'CRUD',
            phases: 'CRUD',
            levels: 'CRUD'
        },
        inventoryManagement: 'CRUD',
        inboundManagement: {
            stockTransfers: 'CRUD',
            purchaseOrders: 'CRUD',
            ntds: 'CRUD',
            inboundTransaction: 'CRUD',
            staging: 'CRUD'
        },
        outboundManagement: {
            purchaseOrders: 'CRUD',
            mfcRequests: 'CRUD',
            salesOrders: 'CRUD',
            stockTransferOrders: 'CRUD',
            outboundTransactions: 'CRUD',
            pickings: 'CRUD',
            dispatchs: 'CRUD'
        },
        skuManagement: 'CRUD',
        deviceManagement: 'CRUD',
        announcementManagement: 'CRUD',
        reportsManagement: 'CRUD',
        userManagement: 'CRUD',
        userPermissionsManagement: 'CRUD',
        clientManagement: 'CRUD',
        courierManagement: 'CRUD',
        systemLogs: 'CRUD'
    },
    supervisor: {
        productsManagement: {
            products: 'CRUD',
            variants: 'CRUD'
        },
        productTypeManagement: {
            categories: 'CRUD',
            brands: 'CRUD',
            suppliers: 'CRUD',
            departments: 'CRUD'
        },
        warehouseManagement: {
            warehouseLocations: 'CRUD',
            displayLocations: 'CRUD',
            warehouse: 'CRUD',
            aisles: 'CRUD',
            racks: 'CRUD',
            pallets: 'CRUD',
            crates: 'CRUD',
            phases: 'CRUD',
            levels: 'CRUD'
        },
        inventoryManagement: 'CRUD',
        inboundManagement: {
            stockTransfers: 'CRUD',
            purchaseOrders: 'CRUD',
            ntds: 'CRUD',
            inboundTransaction: 'CRUD',
            staging: 'CRUD'
        },
        outboundManagement: {
            purchaseOrders: 'CRUD',
            mfcRequests: 'CRUD',
            salesOrders: 'CRUD',
            stockTransferOrders: 'CRUD',
            outboundTransactions: 'CRUD',
            pickings: 'CRUD',
            dispatchs: 'CRUD'
        },
        skuManagement: 'CRUD',
        deviceManagement: 'CRUD',
        announcementManagement: 'CRUD',
        reportsManagement: 'CRUD',
        userManagement: 'CRUD',
        userPermissionsManagement: 'CRUD',
        clientManagement: 'CRUD',
        courierManagement: 'CRUD',
        systemLogs: 'CRUD'
    },
    associate: {
        productsManagement: {
            products: 'CRUD',
            variants: 'CRUD'
        },
        productTypeManagement: {
            categories: 'CRUD',
            brands: 'CRUD',
            suppliers: 'CRUD',
            departments: 'CRUD'
        },
        warehouseManagement: {
            warehouseLocations: 'CRUD',
            displayLocations: 'CRUD',
            warehouse: 'CRUD',
            aisles: 'CRUD',
            racks: 'CRUD',
            pallets: 'CRUD',
            crates: 'CRUD',
            phases: 'CRUD',
            levels: 'CRUD'
        },
        inventoryManagement: 'CRUD',
        inboundManagement: {
            stockTransfers: 'CRUD',
            purchaseOrders: 'CRUD',
            ntds: 'CRUD',
            inboundTransaction: 'CRUD',
            staging: 'CRUD'
        },
        outboundManagement: {
            purchaseOrders: 'CRUD',
            mfcRequests: 'CRUD',
            salesOrders: 'CRUD',
            stockTransferOrders: 'CRUD',
            outboundTransactions: 'CRUD',
            pickings: 'CRUD',
            dispatchs: 'CRUD'
        },
        skuManagement: 'CRUD',
        deviceManagement: 'CRUD',
        announcementManagement: 'CRUD',
        reportsManagement: 'CRUD',
        userManagement: 'CRUD',
        userPermissionsManagement: 'CRUD',
        clientManagement: 'CRUD',
        courierManagement: 'CRUD',
        systemLogs: 'CRUD'
    },
    picker: {}
};
exports.DEFAULT_SUPER_ADMIN_COLUMNS = ['name', 'username', 'contact_number', 'address', 'password', 'role_id'];
exports.DEFAULT_SUPER_ADMIN_VALUES = ["'Super Admin'", "'super_admin'", "'09123456789'", "'Sauyo Quezon City'"];
//# sourceMappingURL=permissions.js.map