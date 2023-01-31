import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { OrderEntity } from './OrderEntities';
import { ProductsEntity } from './ProductEntities';

@Entity(Entities.ORDER_PRODUCTS, { schema: ORM_DB_SCHEMA })
export class OrderProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
    total: number;

    @Column({ nullable: true })
    @PrimaryColumn()
    orderId: string;

    @Column({ nullable: true })
    @PrimaryColumn()
    productId: string;

    @ManyToOne(() => OrderEntity, (o) => o.order_products)
    order: OrderEntity;

    @ManyToOne(() => ProductsEntity, (p) => p.order_products)
    product: ProductsEntity;
}
