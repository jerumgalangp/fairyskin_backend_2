import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonEntity } from './Common';
import { CustomerEntity } from './CustomerEntities';
import { RoleEntity } from './RoleEntities';
import { SessionEntity } from './SessionEntites';
import { TrackingEntity } from './TrackingEntities';
import { TrackingMainEntity } from './TrackingMainEntities';

@Entity(Entities.USER, { schema: ORM_DB_SCHEMA })
export class UserEntity extends CommonEntity {
    @Column({ nullable: false })
    name?: string;

    @Column({ nullable: false })
    username?: string;

    @Column({ nullable: false })
    password?: string;

    @Column({ nullable: false })
    contact_number?: string;

    @Column({ nullable: false })
    address?: string;

    @Column({ nullable: false })
    force_ind?: string;

    /* Foreign Ids */
    @Column({ nullable: false })
    role_id?: string;

    /* Relationships */
    @ManyToOne(() => RoleEntity, ({ roles }) => roles)
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    @OneToOne(() => SessionEntity, ({ user_id }) => user_id, { onDelete: 'CASCADE' })
    session_id: SessionEntity;

    @OneToOne(() => CustomerEntity, ({ user_id }) => user_id)
    customer_id: CustomerEntity;

    @OneToMany(() => TrackingEntity, (op) => op.customer)
    distributed_products: TrackingEntity[];

    @OneToMany(() => TrackingMainEntity, ({ tracking_main_customer }) => tracking_main_customer)
    tracking_main: TrackingMainEntity[];
}
