import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonEntity } from './Common';
import { OrderEntity } from './OrderEntities';
import { PaymentEntity } from './PaymentEntities';

@Entity(Entities.INVOICE, { schema: ORM_DB_SCHEMA })
export class InvoiceEntity extends CommonEntity {
    @Column({ nullable: false })
    invoice_code: string;

    @Column({ nullable: true })
    reference_value: string;

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

    @Column({ nullable: false })
    invoice_date: Date;

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

    @Column({ nullable: true })
    payment_status: string;

    /* Relationships */
    @OneToOne(() => OrderEntity, ({ order_id }) => order_id)
    @JoinColumn({ name: 'invoice_order_id' })
    invoice_order: OrderEntity;

    /* Relationships */
    @OneToMany(() => PaymentEntity, ({ payment_invoice }) => payment_invoice)
    payments: PaymentEntity[];
}
