import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { OrderEntity } from './OrderEntities';
import { ProductsEntity } from './ProductEntities';

@Entity(Entities.ORDER_DELIVERED, { schema: ORM_DB_SCHEMA })
export class OrderDeliveredEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    original_quantity: number;

    @Column({ nullable: true })
    delivered_quantity: number;

    @Column({ nullable: true })
    delivered_date: Date;

    @Column({ nullable: true })
    remaining_quantity: number;

    @Column({ nullable: true })
    distributed_quantity: number;

    @Column({ nullable: true })
    @PrimaryColumn()
    orderId: string;

    @Column({ nullable: true })
    @PrimaryColumn()
    productId: string;

    @ManyToOne(() => OrderEntity, (o) => o.order_delivered)
    order: OrderEntity;

    @ManyToOne(() => ProductsEntity, (p) => p.order_delivered)
    product: ProductsEntity;
}
