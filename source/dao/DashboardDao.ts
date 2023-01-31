import { getManager } from 'typeorm';
import { Entities } from '../constant/Entities';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { AreaEntity } from './../entities/AreaEntities';
import { CustomerEntity } from './../entities/CustomerEntities';
import { InvoiceEntity } from './../entities/InvoiceEntities';
import { OrderEntity } from './../entities/OrderEntities';
import { OrderProductEntity } from './../entities/OrderProductEntities';
import { PaymentEntity } from './../entities/PaymentEntities';
import { ProductsEntity } from './../entities/ProductEntities';
import { useSchemaAndTableName } from './../util/Schema';

export const useDashboardDao = () => {
    const getDashboardSalesPerTransaction = async (payload: { [column: string]: any }[]) => {
        try {
            // let where = '';
            let where2 = '';

            if (payload.length > 0) {
                let date_from = payload[0];
                let date_to = payload[1];
                let pay_2 = payload[2];
                let area = payload[3];

                if (date_from !== undefined && date_from.df !== undefined && date_to !== undefined && date_to.dt) {
                    where2 = `DATE(${Entities.ORDER_DELIVERED}.delivered_date) BETWEEN DATE('${date_from.df._value}') AND DATE('${date_to.dt._value}')`;
                }

                if (pay_2 !== undefined && pay_2.p !== undefined) {
                    where2 = `${Entities.PRODUCTS}."id" = '${pay_2.p._value}'`;
                }

                if (pay_2 !== undefined && pay_2.a !== undefined) {
                    where2 = where2 + ` AND ${Entities.CUSTOMER}.customer_area = '${pay_2.a._value}'`;
                }

                if (area !== undefined && area.p !== undefined) {
                    where2 = where2 + ` AND ${Entities.CUSTOMER}.customer_area = '${area.a._value}'`;
                }
            }

            let query_spt: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.INVOICE}.id`, 'id')
                .addSelect(`SUM(${Entities.PAYMENT}.payment_amount)`, 'payment_amount')
                .addSelect(`${Entities.INVOICE}.invoice_code`, 'invoice_code')
                .from(useSchemaAndTableName(Entities.ORDER_DELIVERED), Entities.ORDER_DELIVERED)
                .leftJoin(InvoiceEntity, `${Entities.INVOICE}`, `${Entities.INVOICE}.invoice_order_id = ${Entities.ORDER_DELIVERED}."orderId"`)
                .leftJoin(PaymentEntity, `${Entities.PAYMENT}`, `${Entities.PAYMENT}.payment_invoice_id = ${Entities.INVOICE}.id`)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .groupBy('invoice_code')
                .addGroupBy(`${Entities.INVOICE}.id`)
                .where(where2);

            let query_spp: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.ORDER_DELIVERED}."productId"`, 'id')
                .addSelect(`SUM(${Entities.ORDER_PRODUCTS}.total)`, 'payment_amount')
                .addSelect(`${Entities.PRODUCTS}.product_name`, 'product_name')
                .from(useSchemaAndTableName(Entities.ORDER_DELIVERED), Entities.ORDER_DELIVERED)
                .leftJoin(OrderProductEntity, `${Entities.ORDER_PRODUCTS}`, `${Entities.ORDER_PRODUCTS}."productId" = ${Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.ORDER_PRODUCTS}."orderId"`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .groupBy(`${Entities.ORDER_DELIVERED}."productId"`)
                .addGroupBy(`${Entities.PRODUCTS}.product_code`)
                .addGroupBy(`${Entities.PRODUCTS}.product_name`)
                .where(where2);

            let query_ms: any = getManager()
                .createQueryBuilder()
                .select(`TO_CHAR(${Entities.ORDER_DELIVERED}.delivered_date, 'MM/YYYY')`, 'delivered_date')
                .addSelect(`SUM(${Entities.PAYMENT}.payment_amount)`, 'payment_amount')
                .from(useSchemaAndTableName(Entities.ORDER_DELIVERED), Entities.ORDER_DELIVERED)
                .leftJoin(InvoiceEntity, `${Entities.INVOICE}`, `${Entities.INVOICE}.invoice_order_id = ${Entities.ORDER_DELIVERED}."orderId"`)
                .leftJoin(PaymentEntity, `${Entities.PAYMENT}`, `${Entities.PAYMENT}.payment_invoice_id = ${Entities.INVOICE}.id`)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .groupBy(`TO_CHAR(${Entities.ORDER_DELIVERED}.delivered_date, 'MM/YYYY')`)
                .where(where2);

            let query_mt: any = getManager()
                .createQueryBuilder()
                .select(`TO_CHAR(${Entities.ORDER_DELIVERED}.delivered_date, 'MM/DD/YYYY')`, 'delivered_date')
                .addSelect(`SUM(${Entities.PAYMENT}.payment_amount)`, 'payment_amount')
                .from(useSchemaAndTableName(Entities.ORDER_DELIVERED), Entities.ORDER_DELIVERED)
                .leftJoin(InvoiceEntity, `${Entities.INVOICE}`, `${Entities.INVOICE}.invoice_order_id = ${Entities.ORDER_DELIVERED}."orderId"`)
                .leftJoin(PaymentEntity, `${Entities.PAYMENT}`, `${Entities.PAYMENT}.payment_invoice_id = ${Entities.INVOICE}.id`)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .groupBy(`TO_CHAR(${Entities.ORDER_DELIVERED}.delivered_date, 'MM/DD/YYYY')`)
                .where(where2)
                .orderBy(`TO_CHAR(${Entities.ORDER_DELIVERED}.delivered_date, 'MM/DD/YYYY')`);

            let query_sopp: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.ORDER_DELIVERED}."productId"`, 'id')
                .addSelect(`SUM(${Entities.ORDER_PRODUCTS}.quantity)`, 'quantity')
                .addSelect(`${Entities.PRODUCTS}.product_name`, 'product_name')
                .from(useSchemaAndTableName(Entities.ORDER_DELIVERED), Entities.ORDER_DELIVERED)
                .leftJoin(OrderProductEntity, `${Entities.ORDER_PRODUCTS}`, `${Entities.ORDER_PRODUCTS}."productId" = ${Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.ORDER_PRODUCTS}."orderId"`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .groupBy(`${Entities.ORDER_DELIVERED}."productId"`)
                .addGroupBy(`${Entities.PRODUCTS}.product_code`)
                .addGroupBy(`${Entities.PRODUCTS}.product_name`)
                .where(where2);

            let query_tspa: any = getManager()
                .createQueryBuilder()
                .select(`area_name`, 'customer_area')
                .addSelect(`SUM(${Entities.PAYMENT}.payment_amount)`, 'payment_amount')
                .from(useSchemaAndTableName(Entities.ORDER_DELIVERED), Entities.ORDER_DELIVERED)
                .leftJoin(InvoiceEntity, `${Entities.INVOICE}`, `${Entities.INVOICE}.invoice_order_id = ${Entities.ORDER_DELIVERED}."orderId"`)
                .leftJoin(PaymentEntity, `${Entities.PAYMENT}`, `${Entities.PAYMENT}.payment_invoice_id = ${Entities.INVOICE}.id`)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_DELIVERED}."productId"`)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .leftJoin(AreaEntity, `${Entities.AREA}`, `${Entities.AREA}.id = ${Entities.CUSTOMER}.customer_area`)
                .groupBy(`area_name`)
                .where(where2)
                .orderBy('payment_amount', 'DESC');

            let annual_sales: any = getManager()
                .createQueryBuilder()
                .select(`SUM(${Entities.PAYMENT}.payment_amount)`, 'payment_amount')
                .from(useSchemaAndTableName(Entities.PAYMENT), Entities.PAYMENT)
                .where(`TO_CHAR(CURRENT_DATE, 'YYYY') = TO_CHAR(payment_date,'YYYY')`);

            // let spp: any = getManager()
            //     .createQueryBuilder()
            //     .select(`total_payment.payment_invoice_id`, 'payment_invoice_id')
            //     .addSelect(`${Entities.PRODUCTS}.product_name`, 'product_name')
            //     .addSelect('total_payment.payment_amount', 'payment_amount')
            //     .from('(' + totalPayment.getQuery() + ')', 'total_payment')
            //     .leftJoin(InvoiceEntity, `${Entities.INVOICE}`, `${Entities.INVOICE}.id = total_payment.payment_invoice_id`)
            //     .leftJoin(OrderProductEntity, `${Entities.ORDER_PRODUCTS}`, `${Entities.ORDER_PRODUCTS}."orderId" = ${Entities.INVOICE}.invoice_order_id`)
            //     .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_PRODUCTS}."productId"`)
            //     .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE}.invoice_order_id`)
            //     .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
            //     .where(where2);

            // let query_spt: any = getManager()
            //     .createQueryBuilder()
            //     .select('DISTINCT(invoice_code)', 'invoice_code')
            //     .addSelect('payment_amount', 'payment_amount')
            //     .from('(' + spt.getQuery() + ')', 'a')
            //     .orderBy(`invoice_code`);

            // let query_spp: any = getManager()
            //     .createQueryBuilder()
            //     .select('DISTINCT(product_name)', 'product_name')
            //     .addSelect('payment_amount', 'payment_amount')
            //     .from('(' + spp.getQuery() + ')', 'a')
            //     .orderBy(`product_name`);

            // console.log('----------------------------------------');
            //raw mayn offset limit
            const results_spt = await query_spt.getRawMany();
            const results_spp = await query_spp.getRawMany();
            const results_ms = await query_ms.getRawMany();
            const results_mt = await query_mt.getRawMany();
            const results_sopp = await query_sopp.getRawMany();
            const results_tspa = await query_tspa.getRawMany();
            const results_annual_sales = await annual_sales.getRawMany();

            // console.log('-----------results------------');
            // console.log(query);
            // console.log('----------results-------------');

            // console.log('-----------results------------');
            // console.log(results);
            // console.log('----------results-------------');

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results_spt,
                results_spp,
                results_ms,
                results_mt,
                results_sopp,
                results_tspa,
                results_annual_sales
            };
        } catch (err) {
            console.log('Error Dao: Query for getDashboardSalesPerTransaction Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    return {
        getDashboardSalesPerTransaction
    };
};
