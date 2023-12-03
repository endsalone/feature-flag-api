import { Expose } from 'class-transformer';
import { Rule } from 'modules/feature/domain/rule';
import { Target } from 'modules/feature/domain/target';
import { TargetEntity } from 'modules/feature/domain/target.entity';
import { Environment } from 'modules/project/domain/environment';
import { EnvironmentEntity } from 'modules/project/domain/environment.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Feature } from './feature';
import { FeatureEntity } from './feature.entity';

@Entity('rules')
export class RuleEntity implements Rule {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'boolean', nullable: false })
  active: boolean;

  @Expose()
  @ManyToOne(() => EnvironmentEntity)
  @JoinColumn({ name: 'environment_id', referencedColumnName: 'id', foreignKeyConstraintName: 'environment_id_fk' })
  environment: Environment;

  @Expose()
  @ManyToMany(() => TargetEntity)
  @JoinTable({
    name: 'rule_target',
    joinColumn: { name: 'rule_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'target_id', referencedColumnName: 'id' }
  })
  targets: Target[];

  @Expose()
  @ManyToOne(() => FeatureEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feature_id', referencedColumnName: 'id', foreignKeyConstraintName: 'feature_id_fk' })
  feature: Feature;
}
