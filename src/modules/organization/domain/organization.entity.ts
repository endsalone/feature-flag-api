import { Expose } from 'class-transformer';
import { Account } from 'modules/account/domain/account';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { Environment } from 'modules/organization/domain/environment';
import { EnvironmentEntity } from 'modules/organization/domain/environment.entity';
import { Organization } from 'modules/organization/domain/organization';
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

@Entity('organizations')
export class OrganizationEntity implements Organization {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: false })
  name: string;

  @Expose()
  @Column({ type: 'character varying', length: 200, nullable: true })
  key: string;

  @Expose()
  @Column({ type: 'character varying', length: 200, nullable: true })
  hash: string;

  @Expose()
  @Column({ name: 'api_id', type: 'character varying', length: 200, nullable: true })
  apiId: string;

  @Expose()
  @Column({ name: 'api_secret', type: 'character varying', length: 200, nullable: true })
  apiSecret: string;

  @ManyToMany(() => EnvironmentEntity)
  @JoinTable({
    name: 'organization_environments',
    joinColumn: { name: 'organization_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'environment_id', referencedColumnName: 'id' }
  })
  environments: Environment[];

  @ManyToMany(() => AccountEntity)
  @JoinTable({
    name: 'permissions_organizations',
    joinColumn: { name: 'organization_id', referencedColumnName: 'id', foreignKeyConstraintName: 'fk_organization_id' },
    inverseJoinColumn: { name: 'account_id', referencedColumnName: 'id', foreignKeyConstraintName: 'fk_account_id' }
  })
  permissions: Account[];

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
