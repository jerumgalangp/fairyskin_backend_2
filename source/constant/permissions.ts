export enum RoleType {
    SuperAdmin = 'super_admin',
    InventoryAdmin = 'inventory_admin',
    OrderAdmin = 'order_admin',
    WareHouseAdmin = 'warehouse_admin',
    LogisticAdmin = 'logistics_admin',
    FinanceAdmin = 'finance_admin',
    RegionalDist = 'regional_distributor',
    ProvincialDist = 'provincial_distributor',
    DistrictDist = 'district_distributor',
    CityDist = 'city_distributor',
    DealerDist = 'dealer_distributor',
    InternationalFranchise = 'international_franchise',
    InternationalDist = 'international_distributor',
    InternationalStockHist = 'international_stockhist',
    InternationalSubStockHist = 'international_sub_stockhist',
    InternationalReseller = 'international_reseller'
}

export const DEFAULT_PERMISSIONS = {
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

export const DEFAULT_SUPER_ADMIN_COLUMNS = ['name', 'username', 'contact_number', 'address', 'password', 'role_id'];

export const DEFAULT_SUPER_ADMIN_VALUES = ["'Super Admin'", "'super_admin'", "'09123456789'", "'Sauyo Quezon City'"];
