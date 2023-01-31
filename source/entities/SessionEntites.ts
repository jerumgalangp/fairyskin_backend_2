import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ORM_DB_SCHEMA } from '../config/config';
import { Entities } from '../constant/Entities';
import { UserEntity } from './UserEntities';

@Entity(Entities.SESSION, { schema: ORM_DB_SCHEMA })
export class SessionEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    expiry_date: Date;

    /* Foreign Ids */
    @Column({ nullable: false })
    user_id?: string;

    /* Relationships */
    @OneToOne(() => UserEntity, ({ session_id }) => session_id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
