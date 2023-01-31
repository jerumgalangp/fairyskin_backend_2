import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { AreaEntity } from './AreaEntities';
import { CommonEntity } from './Common';
import { OrderEntity } from './OrderEntities';
import { UserEntity } from './UserEntities';

@Entity(Entities.CUSTOMER, { schema: ORM_DB_SCHEMA })
export class CustomerEntity extends CommonEntity {
    @Column({ nullable: true })
    customer_email: string;

    @Column({ nullable: false })
    user_id?: string;

    @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 })
    customer_balance: number;

    @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 })
    customer_over_payment: number;

    @Column({ nullable: true })
    fully_paid: string;

    @Column({ nullable: true })
    customer_payment_status: string;

    @Column({ nullable: true, default: '' })
    customer_status: string;

    @Column({ nullable: true })
    customer_team: string;

    /* Relationships */
    @OneToOne(() => UserEntity, ({ customer_id }) => customer_id)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    /* Relationships */
    @OneToMany(() => OrderEntity, ({ order_customer }) => order_customer)
    customer_orders: OrderEntity[];

    /* Foreign Ids */
    @Column({ nullable: true })
    customer_area?: string;

    /* Relationships */
    @ManyToOne(() => AreaEntity, ({ areas }) => areas)
    @JoinColumn({ name: 'customer_area' })
    area: AreaEntity;
}
