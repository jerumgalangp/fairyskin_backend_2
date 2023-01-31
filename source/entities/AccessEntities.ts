import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { CommonEntity } from './Common';
import { MenuEntity } from './MenuEntities';
import { RoleEntity } from './RoleEntities';

@Entity(Entities.ACCESS, { schema: ORM_DB_SCHEMA })
export class AccessEntity extends CommonEntity {
    /* Foreign Ids */
    @Column({ nullable: false })
    role_id?: string;

    /* Relationships */
    @ManyToOne(() => RoleEntity, ({ roles }) => roles)
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    /* Foreign Ids */
    @Column({ nullable: false })
    menu_id?: string;

    @Column({ nullable: false })
    status?: string;

    /* Relationships */
    @ManyToOne(() => MenuEntity, ({ menus }) => menus)
    @JoinColumn({ name: 'menu_id' })
    menu: MenuEntity;
}
