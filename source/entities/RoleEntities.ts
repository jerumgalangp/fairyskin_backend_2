import { Column, Entity, OneToMany } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonEntity } from './Common';
import { UserEntity } from './UserEntities';

@Entity(Entities.ROLES, { schema: ORM_DB_SCHEMA })
export class RoleEntity extends CommonEntity {
    @Column({ nullable: false })
    role_name?: string;

    @Column({ nullable: false })
    role_description?: string;

    @Column({ nullable: false, default: 'N' })
    recipient?: string;

    /* Relationships */
    @OneToMany(() => UserEntity, ({ role }) => role)
    roles: UserEntity[];
}
