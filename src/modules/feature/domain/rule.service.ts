import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RuleEntity } from 'modules/feature/domain/rule.entity';
import { Repository } from 'typeorm';
import { Rule } from './rule';
import { Target } from './target';
import { TargetEntity } from './target.entity';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(RuleEntity)
    private ruleRepository: Repository<RuleEntity>,
    @InjectRepository(TargetEntity)
    private targetRepository: Repository<TargetEntity>
  ) {}

  async createDefaultRulesWithTarget(rule: Partial<Rule>[]): Promise<RuleEntity | RuleEntity[]> {
    const targets: Partial<Target>[] = rule.flatMap((r) => r.targets);

    await this.targetRepository.save(targets);
    return this.ruleRepository.save(rule as RuleEntity[]);
  }

  async findByFeatureKey(featureKey: string): Promise<RuleEntity[]> {
    return this.ruleRepository
      .createQueryBuilder('rule')
      .innerJoin('rule.feature', 'feature')
      .where('feature.key = :featureKey', { featureKey })
      .innerJoinAndSelect('rule.targets', 'target')
      .innerJoinAndSelect('rule.environment', 'environment')
      .innerJoinAndSelect('target.variationValue', 'variationValue')
      .orderBy('rule.id', 'ASC')
      .getMany();
  }

  async findOneByFeatureKeyAndRuleId(featureKey: string, ruleId: number): Promise<RuleEntity> {
    return this.ruleRepository
      .createQueryBuilder('rule')
      .innerJoin('rule.feature', 'feature')
      .where('feature.key = :featureKey', { featureKey })
      .andWhere('rule.id = :ruleId', { ruleId })
      .innerJoinAndSelect('rule.targets', 'target')
      .innerJoinAndSelect('rule.environment', 'environment')
      .innerJoinAndSelect('target.variationValue', 'variationValue')
      .orderBy('rule.id', 'ASC')
      .getOne();
  }

  async getRuleById(
    id: typeof RuleEntity.prototype.id,
    projectId: typeof RuleEntity.prototype.id
  ): Promise<RuleEntity> {
    return this.ruleRepository
      .createQueryBuilder('rule')
      .innerJoinAndSelect('rule.targets', 'target')
      .innerJoin('rule.feature', 'feature')
      .innerJoin('feature.project', 'project', 'project.id = :projectId', { projectId })
      .innerJoinAndSelect('target.variationValue', 'variationValue')
      .where('rule.id = :id', { id })
      .getOne();
  }

  async update(target: RuleEntity): Promise<RuleEntity> {
    return this.ruleRepository.save(target);
  }

  async delete(id: typeof RuleEntity.prototype.id): Promise<void> {
    await this.ruleRepository.delete(id);
  }
}
