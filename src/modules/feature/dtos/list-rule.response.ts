import { Expose } from 'class-transformer';
import { Rule } from 'modules/feature/domain/rule';
import { Target } from 'modules/feature/domain/target';
import { Environment } from 'modules/project/domain/environment';

export class RuleResponse implements Partial<Rule> {
  @Expose()
  id?: number;
  @Expose()
  active?: boolean;
  @Expose()
  environment?: Environment;
  @Expose()
  targets?: ((Partial<Target> & Partial<Pick<Target, 'id'>>) | (RuleResponse & Partial<Omit<Target, 'id'>>))[];
}
