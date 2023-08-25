import { Exclude, Expose } from 'class-transformer';
import { Account } from 'modules/account/domain/account';
import { ACCOUNT_STATUS, ACCOUNT_TYPE } from 'modules/account/domain/account.type';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('accounts')
export class AccountEntity implements Account {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: false })
  name: string;

  @Expose()
  @Column({ type: 'character varying', length: 255, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: 'text', nullable: false, select: false })
  password: string;

  @Expose()
  @Column({ type: 'boolean', nullable: false, default: false })
  active: boolean;

  @Expose()
  @Column({
    type: 'enum',
    enum: ACCOUNT_STATUS,
    nullable: false
  })
  status: ACCOUNT_STATUS;

  @Expose()
  @Column({
    name: 'type',
    type: 'enum',
    enum: ACCOUNT_TYPE,
    nullable: false
  })
  type: ACCOUNT_TYPE;

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
