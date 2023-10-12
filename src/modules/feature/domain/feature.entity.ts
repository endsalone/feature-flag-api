import { Expose } from 'class-transformer';
import { Feature } from 'modules/feature/domain/feature';
import { FeatureType } from 'modules/feature/domain/feature.type';
import { Variation } from 'modules/feature/domain/variation';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
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

@Entity('features')
export class FeatureEntity implements Feature {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: false })
  key: string;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: false })
  name: string;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: true })
  description: string;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: false, name: 'type' })
  type: FeatureType;

  @Expose()
  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id', foreignKeyConstraintName: 'project_id_fk' })
  project: ProjectEntity;

  @ManyToMany(() => VariationEntity)
  @JoinTable({
    name: 'feature_variation',
    joinColumn: { name: 'feature_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'variation_id', referencedColumnName: 'id' }
  })
  variations: Variation[];

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
