import { Expose } from 'class-transformer';
import { Rule } from 'modules/feature/domain/rule';
import { Target } from 'modules/feature/domain/target';
import { MarkOptional } from 'ts-essentials';

export class UpdateRuleRequest implements MarkOptional<Rule, 'environment' | 'feature'> {
  @Expose()
  id: number;
  @Expose()
  active: boolean;
  @Expose()
  targets: Partial<Omit<Target, 'id'> & Partial<Pick<Target, 'id'>>>[];
}
