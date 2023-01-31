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
exports.useDashboardDao = void 0;
const typeorm_1 = require("typeorm");
const Entities_1 = require("../constant/Entities");
const HttpConstant_1 = require("../constant/HttpConstant");
const AreaEntities_1 = require("./../entities/AreaEntities");
const CustomerEntities_1 = require("./../entities/CustomerEntities");
const InvoiceEntities_1 = require("./../entities/InvoiceEntities");
const OrderEntities_1 = require("./../entities/OrderEntities");
const OrderProductEntities_1 = require("./../entities/OrderProductEntities");
const PaymentEntities_1 = require("./../entities/PaymentEntities");
const ProductEntities_1 = require("./../entities/ProductEntities");
const Schema_1 = require("./../util/Schema");
exports.useDashboardDao = () => {
    const getDashboardSalesPerTransaction = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let where2 = '';
            if (payload.length > 0) {
                let date_from = payload[0];
                let date_to = payload[1];
                let pay_2 = payload[2];
                let area = payload[3];
                if (date_from !== undefined && date_from.df !== undefined && date_to !== undefined && date_to.dt) {
                    where2 = `DATE(${Entities_1.Entities.ORDER_DELIVERED}.delivered_date) BETWEEN DATE('${date_from.df._value}') AND DATE('${date_to.dt._value}')`;
                }
                if (pay_2 !== undefined && pay_2.p !== undefined) {
                    where2 = `${Entities_1.Entities.PRODUCTS}."id" = '${pay_2.p._value}'`;
                }
                if (pay_2 !== undefined && pay_2.a !== undefined) {
                    where2 = where2 + ` AND ${Entities_1.Entities.CUSTOMER}.customer_area = '${pay_2.a._value}'`;
                }
                if (area !== undefined && area.p !== undefined) {
                    where2 = where2 + ` AND ${Entities_1.Entities.CUSTOMER}.customer_area = '${area.a._value}'`;
                }
            }
            let query_spt = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.INVOICE}.id`, 'id')
                .addSelect(`SUM(${Entities_1.Entities.PAYMENT}.payment_amount)`, 'payment_amount')
                .addSelect(`${Entities_1.Entities.INVOICE}.invoice_code`, 'invoice_code')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED), Entities_1.Entities.ORDER_DELIVERED)
                .leftJoin(InvoiceEntities_1.InvoiceEntity, `${Entities_1.Entities.INVOICE}`, `${Entities_1.Entities.INVOICE}.invoice_order_id = ${Entities_1.Entities.ORDER_DELIVERED}."orderId"`)
                .leftJoin(PaymentEntities_1.PaymentEntity, `${Entities_1.Entities.PAYMENT}`, `${Entities_1.Entities.PAYMENT}.payment_invoice_id = ${Entities_1.Entities.INVOICE}.id`)
                .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.id = ${Entities_1.Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .groupBy('invoice_code')
                .addGroupBy(`${Entities_1.Entities.INVOICE}.id`)
                .where(where2);
            let query_spp = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.ORDER_DELIVERED}."productId"`, 'id')
                .addSelect(`SUM(${Entities_1.Entities.ORDER_PRODUCTS}.total)`, 'payment_amount')
                .addSelect(`${Entities_1.Entities.PRODUCTS}.product_name`, 'product_name')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED), Entities_1.Entities.ORDER_DELIVERED)
                .leftJoin(OrderProductEntities_1.OrderProductEntity, `${Entities_1.Entities.ORDER_PRODUCTS}`, `${Entities_1.Entities.ORDER_PRODUCTS}."productId" = ${Entities_1.Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.id = ${Entities_1.Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.ORDER_PRODUCTS}."orderId"`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .groupBy(`${Entities_1.Entities.ORDER_DELIVERED}."productId"`)
                .addGroupBy(`${Entities_1.Entities.PRODUCTS}.product_code`)
                .addGroupBy(`${Entities_1.Entities.PRODUCTS}.product_name`)
                .where(where2);
            let query_ms = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`TO_CHAR(delivered_date, 'MM/YYYY')`, 'delivered_date')
                .addSelect(`SUM(${Entities_1.Entities.PAYMENT}.payment_amount)`, 'payment_amount')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED), Entities_1.Entities.ORDER_DELIVERED)
                .leftJoin(InvoiceEntities_1.InvoiceEntity, `${Entities_1.Entities.INVOICE}`, `${Entities_1.Entities.INVOICE}.invoice_order_id = ${Entities_1.Entities.ORDER_DELIVERED}."orderId"`)
                .leftJoin(PaymentEntities_1.PaymentEntity, `${Entities_1.Entities.PAYMENT}`, `${Entities_1.Entities.PAYMENT}.payment_invoice_id = ${Entities_1.Entities.INVOICE}.id`)
                .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.id = ${Entities_1.Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .groupBy(`TO_CHAR(delivered_date, 'MM/YYYY')`)
                .where(where2);
            let query_mt = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`TO_CHAR(delivered_date, 'MM/DD/YYYY')`, 'delivered_date')
                .addSelect(`SUM(${Entities_1.Entities.PAYMENT}.payment_amount)`, 'payment_amount')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED), Entities_1.Entities.ORDER_DELIVERED)
                .leftJoin(InvoiceEntities_1.InvoiceEntity, `${Entities_1.Entities.INVOICE}`, `${Entities_1.Entities.INVOICE}.invoice_order_id = ${Entities_1.Entities.ORDER_DELIVERED}."orderId"`)
                .leftJoin(PaymentEntities_1.PaymentEntity, `${Entities_1.Entities.PAYMENT}`, `${Entities_1.Entities.PAYMENT}.payment_invoice_id = ${Entities_1.Entities.INVOICE}.id`)
                .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.id = ${Entities_1.Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .groupBy(`TO_CHAR(delivered_date, 'MM/DD/YYYY')`)
                .where(where2)
                .orderBy(`TO_CHAR(delivered_date, 'MM/DD/YYYY')`);
            let query_sopp = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.ORDER_DELIVERED}."productId"`, 'id')
                .addSelect(`SUM(${Entities_1.Entities.ORDER_PRODUCTS}.quantity)`, 'quantity')
                .addSelect(`${Entities_1.Entities.PRODUCTS}.product_name`, 'product_name')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED), Entities_1.Entities.ORDER_DELIVERED)
                .leftJoin(OrderProductEntities_1.OrderProductEntity, `${Entities_1.Entities.ORDER_PRODUCTS}`, `${Entities_1.Entities.ORDER_PRODUCTS}."productId" = ${Entities_1.Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.id = ${Entities_1.Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.ORDER_PRODUCTS}."orderId"`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .groupBy(`${Entities_1.Entities.ORDER_DELIVERED}."productId"`)
                .addGroupBy(`${Entities_1.Entities.PRODUCTS}.product_code`)
                .addGroupBy(`${Entities_1.Entities.PRODUCTS}.product_name`)
                .where(where2);
            let query_tspa = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`area_name`, 'customer_area')
                .addSelect(`SUM(${Entities_1.Entities.PAYMENT}.payment_amount)`, 'payment_amount')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED), Entities_1.Entities.ORDER_DELIVERED)
                .leftJoin(InvoiceEntities_1.InvoiceEntity, `${Entities_1.Entities.INVOICE}`, `${Entities_1.Entities.INVOICE}.invoice_order_id = ${Entities_1.Entities.ORDER_DELIVERED}."orderId"`)
                .leftJoin(PaymentEntities_1.PaymentEntity, `${Entities_1.Entities.PAYMENT}`, `${Entities_1.Entities.PAYMENT}.payment_invoice_id = ${Entities_1.Entities.INVOICE}.id`)
                .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.id = ${Entities_1.Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .leftJoin(AreaEntities_1.AreaEntity, `${Entities_1.Entities.AREA}`, `${Entities_1.Entities.AREA}.id = ${Entities_1.Entities.CUSTOMER}.customer_area`)
                .groupBy(`area_name`)
                .where(where2)
                .orderBy('payment_amount', 'DESC');
            let annual_sales = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`SUM(${Entities_1.Entities.PAYMENT}.payment_amount)`, 'payment_amount')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.PAYMENT), Entities_1.Entities.PAYMENT)
                .where(`TO_CHAR(CURRENT_DATE, 'YYYY') = TO_CHAR(payment_date,'YYYY')`);
            const results_spt = yield query_spt.getRawMany();
            const results_spp = yield query_spp.getRawMany();
            const results_ms = yield query_ms.getRawMany();
            const results_mt = yield query_mt.getRawMany();
            const results_sopp = yield query_sopp.getRawMany();
            const results_tspa = yield query_tspa.getRawMany();
            const results_annual_sales = yield annual_sales.getRawMany();
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results_spt,
                results_spp,
                results_ms,
                results_mt,
                results_sopp,
                results_tspa,
                results_annual_sales });
        }
        catch (err) {
            console.log('Error Dao: Query for getDashboardSalesPerTransaction Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getDashboardSalesPerTransaction
    };
};
//# sourceMappingURL=DashboardDao.js.map