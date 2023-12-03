import { Expose } from 'class-transformer';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { OrganizationEntity } from 'modules/organization/domain/organization.entity';
import { Environment } from 'modules/project/domain/environment';
import { EnvironmentEntity } from 'modules/project/domain/environment.entity';
import { Permission } from 'modules/project/domain/permission';

import { Project } from 'modules/project/domain/project';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
    name: 'permissions_projects',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'account_id', referencedColumnName: 'id' }
  })
  permissions: AccountEntity[] | Permission[];

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({
    name: 'organization_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'project_organization_id_fk'
  })
  organization: OrganizationEntity;

  @ManyToMany(() => EnvironmentEntity)
  @JoinTable({
    name: 'project_environments',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'environment_id', referencedColumnName: 'id' }
  })
  environments: Environment[];

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
