import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonPendingEntity } from './CommonPendingEntities';
import { OrderEntity } from './OrderEntities';

@Entity(Entities.INVOICE_PENDING, { schema: ORM_DB_SCHEMA })
export class InvoicePendingEntity extends CommonPendingEntity {
    @Column({ nullable: false })
    invoice_code: string;

    @Column({ nullable: true })
    reference_value: string;

    @Column({ nullable: false })
    invoice_date: Date;

    @Column({ nullable: true })
    est_weight: string;

    @Column({ nullable: true })
    special_note: string;

    @Column({ nullable: true })
    shipping_details: string;

    @Column({ nullable: true })
    transportation: string;

    @Column({ nullable: true })
    carrier: string;

    @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 })
    delivery_fee: number;

    @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 })
    down_payment: number;

    @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 })
    total_order: number;

    @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 })
    amount_to_pay: number;

    @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2, default: 0 })
    over_payment: number;

    @Column({ nullable: false })
    invoice_order_id?: string;

    @Column({ nullable: true })
    approval_ind: string;

    /* Relationships */
    @OneToOne(() => OrderEntity, ({ order_id }) => order_id)
    @JoinColumn({ name: 'invoice_order_id' })
    invoice_order: OrderEntity;
}
