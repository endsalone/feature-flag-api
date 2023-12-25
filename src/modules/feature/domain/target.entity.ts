import { Expose } from 'class-transformer';
import { Target } from 'modules/feature/domain/target';
import { ComparatorEnum, DefinitionEnum } from 'modules/feature/domain/target.type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { VariationValueEntity } from './variation-value.entity';

@Entity('targets')
export class TargetEntity implements Target {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'character varying', length: 255, nullable: false })
  name: string;

  @Expose()
  @Column({ name: 'definition_property', type: 'character varying', length: 80, nullable: false })
  definitionProperty: DefinitionEnum | string;

  @Expose()
  @Column({
    name: 'definition_comparator',
    type: 'character varying',
    length: 80,
    nullable: true
  })
  definitionComparator: ComparatorEnum | null;

  @Expose()
  @Column({ name: 'definition_value', type: 'character varying', length: 255, nullable: true, array: true })
  definitionValue: string[] | null;

  @Expose()
  @ManyToOne(() => VariationValueEntity)
  @JoinColumn({
    name: 'variation_value_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'variation_value_id_fk'
  })
  variationValue: VariationValueEntity;

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
