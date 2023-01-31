import { Column, Entity, OneToMany } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { AccessEntity } from './AccessEntities';
import { CommonEntity } from './Common';

@Entity(Entities.MENU, { schema: ORM_DB_SCHEMA })
export class MenuEntity extends CommonEntity {
    @Column({ nullable: false })
    menu_name: string;

    @Column({ nullable: false })
    order: number;

    @Column({ nullable: true })
    menu_route: string;

    /* Relationships */
    @OneToMany(() => AccessEntity, ({ menu }) => menu)
    menus: AccessEntity[];
}
