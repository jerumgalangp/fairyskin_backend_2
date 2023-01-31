import { Column, Entity } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonEntity } from './Common';

@Entity(Entities.PARAMETER, { schema: ORM_DB_SCHEMA })
export class ParameterEntity extends CommonEntity {
    @Column()
    parameter_name: string;

    @Column()
    parameter_value: string;

    @Column()
    parameter_type: string;
}
