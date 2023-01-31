import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { ProductsEntity } from './ProductEntities';
import { UserEntity } from './UserEntities';

@Entity(Entities.ORDER_DISTRIBUTED, { schema: ORM_DB_SCHEMA })
export class TrackingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    date_distributed: Date;

    @Column({ nullable: true })
    quantity: number;

    @Column({ nullable: false })
    reference_value: string;

    @Column({ nullable: true })
    @PrimaryColumn()
    productId: string;

    @Column({ nullable: true })
    @PrimaryColumn()
    customerId: string;

    @ManyToOne(() => ProductsEntity, (p) => p.distributed_products)
    product: ProductsEntity;

    @ManyToOne(() => UserEntity, (p) => p.distributed_products)
    customer: UserEntity;
}
