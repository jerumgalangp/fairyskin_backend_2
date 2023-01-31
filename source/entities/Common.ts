import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    created_by: string;
    @Column({ nullable: true })
    updated_by: string;
    @Column({ nullable: true })
    deleted_by: string;

    @CreateDateColumn({ name: 'created_at', nullable: false }) 'created_at': Date;
    @UpdateDateColumn({ name: 'updated_at', nullable: false }) 'updated_at': Date;
    @DeleteDateColumn({ name: 'deleted_at' }) 'deleted_at'?: Date;
}
