import { Column, Entity, OneToMany } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonEntity } from './Common';
import { OrderDeliveredEntity } from './OrderDeliveredEntities';
import { OrderProductEntity } from './OrderProductEntities';
import { TrackingEntity } from './TrackingEntities';

@Entity(Entities.PRODUCTS, { schema: ORM_DB_SCHEMA })
export class ProductsEntity extends CommonEntity {
    @Column({ nullable: false })
    product_code: string;

    @Column({ nullable: false })
    product_name: string;

    @Column({ nullable: false })
    quantity: number;

    @Column({ nullable: true })
    ordered_quantity: number;

    @Column({ nullable: true })
    forecasted_quantity: number;

    @Column({ nullable: true })
    approval_ind: string;

    @Column({ nullable: true })
    reference_value: string;

    // @ManyToMany(() => OrderEntity, (o) => o.products)
    // orders: OrderEntity[];

    // @ManyToMany(() => OrderEntity, (o) => o.products)
    // orders: OrderEntity[];

    // @OneToOne(() => ProductsPendingEntity, ({ product_id }) => product_id)
    // product_pending: ProductsPendingEntity;

    @OneToMany(() => OrderProductEntity, (op) => op.product)
    order_products: OrderProductEntity[];

    @OneToMany(() => OrderDeliveredEntity, (op) => op.product)
    order_delivered: OrderDeliveredEntity[];

    @OneToMany(() => TrackingEntity, (op) => op.product)
    distributed_products: TrackingEntity[];
}
