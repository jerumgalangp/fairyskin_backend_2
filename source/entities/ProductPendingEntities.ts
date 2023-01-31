import { Column, Entity } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonPendingEntity } from './CommonPendingEntities';

@Entity(Entities.PRODUCTS_PENDING, { schema: ORM_DB_SCHEMA })
export class ProductsPendingEntity extends CommonPendingEntity {
    @Column({ nullable: false })
    product_code: string;

    @Column({ nullable: false })
    product_name: string;

    @Column({ nullable: false })
    quantity: number;

    @Column({ nullable: true })
    reference_value: string;

    @Column({ nullable: true })
    forecasted_quantity: number;

    // @Column({ nullable: true })
    // product_id?: string;

    // /* Relationships */
    // @OneToOne(() => ProductsEntity, ({ product_pending }) => product_pending)
    // @JoinColumn({ name: 'product_id' })
    // product: ProductsEntity;

    @Column({ nullable: true })
    approval_ind: string;
}
