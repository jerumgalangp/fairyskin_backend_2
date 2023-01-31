import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonEntity } from './Common';
import { OrderEntity } from './OrderEntities';
import { UserEntity } from './UserEntities';

@Entity(Entities.ORDER_DISTRIBUTED_MAIN, { schema: ORM_DB_SCHEMA })
export class TrackingMainEntity extends CommonEntity {
    @Column({ nullable: false })
    reference_value: string;

    /* Foreign Ids */
    @Column({ nullable: false })
    user_id?: string;

    /* Foreign Ids */
    @Column({ nullable: false })
    distributed_quantity?: number;

    /* Relationships */
    @ManyToOne(() => UserEntity, ({ tracking_main }) => tracking_main)
    @JoinColumn({ name: 'user_id' })
    tracking_main_customer: UserEntity;

    /* Foreign Ids */
    @Column({ nullable: false })
    order_id?: string;

    /* Relationships */
    @ManyToOne(() => OrderEntity, ({ tracking_main }) => tracking_main)
    @JoinColumn({ name: 'order_id' })
    tracking_main_order: OrderEntity;
}
