import { Expose } from 'class-transformer';
import { Variation } from 'modules/feature/domain/variation';
import { VariationValue } from 'modules/feature/domain/variation-value';
import { VariationValueEntity } from 'modules/feature/domain/variation-value.entity';
import { VariationType } from 'modules/feature/domain/variation.type';
import { ProjectEntity } from 'modules/project/domain/project.entity';
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

@Entity('variations')
export class VariationEntity implements Variation {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: false })
  key: string;

  @Expose()
  @Column({ type: 'character varying', length: 220, nullable: true })
  description: string;

  @Expose()
  @Column({ type: 'character varying', length: 20, nullable: false, name: 'type' })
  type: VariationType;

  @Expose()
  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id', foreignKeyConstraintName: 'project_id_variation_fk' })
  project: ProjectEntity;

  @ManyToMany(() => VariationValueEntity)
  @JoinTable({
    name: 'variations_variation_values',
    joinColumn: { name: 'variation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'variation_value_id', referencedColumnName: 'id' }
  })
  values: VariationValue[];

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
