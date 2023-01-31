import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonEntity } from './Common';
import { CustomerEntity } from './CustomerEntities';
import { InvoiceEntity } from './InvoiceEntities';
import { OrderDeliveredEntity } from './OrderDeliveredEntities';
import { TrackingMainEntity } from './TrackingMainEntities';

import { OrderProductEntity } from './OrderProductEntities';

@Entity(Entities.ORDER, { schema: ORM_DB_SCHEMA })
export class OrderEntity extends CommonEntity {
    @Column({ nullable: false })
    si_number: string;

    @Column({ nullable: true })
    reference_value: string;

    @Column({ nullable: true })
    staggered: string;

    @Column({ nullable: true })
    order_status: string;

    @Column({ nullable: true })
    payment_status: string;

    @Column({ nullable: true })
    order_date: Date;

    @Column({ nullable: true })
    delivered_date: Date;

    @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 })
    amount_to_pay: number;

    @Column({ nullable: true })
    payment_remarks: string;

    @Column({ nullable: true })
    order_remarks: string;

    @Column({ nullable: true })
    approval_ind: string;

    /* Foreign Ids */
    @Column({ nullable: false })
    customer_id?: string;

    /* Relationships */
    @ManyToOne(() => CustomerEntity, ({ customer_orders }) => customer_orders)
    @JoinColumn({ name: 'customer_id' })
    order_customer: CustomerEntity;

    @OneToMany(() => OrderProductEntity, (op) => op.order)
    order_products: OrderProductEntity[];

    @OneToOne(() => InvoiceEntity, ({ invoice_order }) => invoice_order)
    order_id: InvoiceEntity;

    @OneToMany(() => OrderDeliveredEntity, (op) => op.order)
    order_delivered: OrderDeliveredEntity[];

    @OneToMany(() => TrackingMainEntity, ({ tracking_main_order }) => tracking_main_order)
    tracking_main: TrackingMainEntity[];

    // @ManyToMany(() => ProductsEntity, (p) => p.orders)
    // @JoinTable({
    //     name: 'tbl_order_products',
    //     joinColumn: {
    //         name: 'orderId',
    //         referencedColumnName: 'id'
    //     },
    //     inverseJoinColumn: {
    //         name: 'productId',
    //         referencedColumnName: 'id'
    //     }
    // })
    // products: ProductsEntity[];
}
