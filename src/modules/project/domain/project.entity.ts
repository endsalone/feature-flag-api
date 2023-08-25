import { Expose } from 'class-transformer';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { Permission } from 'modules/project/domain/permission';
import { Project } from 'modules/project/domain/project';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('projects')
export class ProjectEntity implements Project {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: false })
  name: string;

  @Expose()
  @Column({ type: 'character varying', length: 250, nullable: true })
  description: string;

  @Expose()
  @Column({ type: 'character varying', length: 200, nullable: true })
  slug: string;

  @ManyToMany(() => AccountEntity)
  @JoinTable({
    name: 'permissions',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'account_id', referencedColumnName: 'id' }
  })
  permissions: AccountEntity[] | Permission[];

  @Expose()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  createdAt?: Date;

  @Expose()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false
  })
  deletedAt?: Date;
}
