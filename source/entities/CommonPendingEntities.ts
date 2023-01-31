import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class CommonPendingEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    request_by: string;
    @Column({ nullable: true })
    event_request: string;
    @Column({ nullable: true })
    request_date: Date;
}
