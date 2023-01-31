import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonEntity } from './Common';
import { InvoiceEntity } from './InvoiceEntities';

@Entity(Entities.PAYMENT, { schema: ORM_DB_SCHEMA })
export class PaymentEntity extends CommonEntity {
    @Column({ nullable: false })
    payment_date: Date;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2, default: 0 })
    payment_balance: number;

    @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2, default: 0 })
    payment_amount: number;

    @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2, default: 0 })
    account_balance: number;

    @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2, default: 0 })
    over_payment: number;

    @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 })
    previous_over_payment: number;

    @Column({ nullable: true })
    recent: string;

    /* Foreign Ids */
    @Column({ nullable: false })
    payment_invoice_id?: string;

    /* Relationships */
    @ManyToOne(() => InvoiceEntity, ({ payments }) => payments)
    @JoinColumn({ name: 'payment_invoice_id' })
    payment_invoice: InvoiceEntity;

    /* Relationships */
    // @OneToOne(() => EWTEntity, ({ payment_ewt_data_id }) => payment_ewt_data_id)
    // ewt_payment: EWTEntity;

    // @OneToOne(() => EWTEntity, (ewt) => ewt.payment, {
    //     cascade: true
    // })

    // @OneToOne(() => EWTEntity, ({ ewt }) => ewt)
    // payment_ewt_id: EWTEntity;
}
