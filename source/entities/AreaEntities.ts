import { Column, Entity, OneToMany } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonEntity } from './Common';
import { CustomerEntity } from './CustomerEntities';

@Entity(Entities.AREA, { schema: ORM_DB_SCHEMA })
export class AreaEntity extends CommonEntity {
    @Column({ nullable: false })
    area_name?: string;

    /* Relationships */
    @OneToMany(() => CustomerEntity, ({ area }) => area)
    areas: CustomerEntity[];
}
