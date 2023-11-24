import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { FeatureDoesNotExistException } from 'modules/feature/domain/exception/feature-does-not-exist';
import { Rule } from 'modules/feature/domain/rule';
import { RuleService } from 'modules/feature/domain/rule.service';
import { Target } from 'modules/feature/domain/target';
import { VariationValue } from 'modules/feature/domain/variation-value';
import { EnvironmentResponse } from 'modules/feature/dtos/environment.response';
import { RuleResponse } from 'modules/feature/dtos/list-rule.response';
import { ListTargetResponse } from 'modules/feature/dtos/list-target.response';
import { VariationValueResponse } from 'modules/feature/dtos/variation-value.response';
import { Environment } from 'modules/organization/domain/environment';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class ListRule {
  constructor(private projectService: ProjectService, private ruleService: RuleService) {}

  async execute(featureKey: string): Promise<RuleResponse[]> {
    const rules = await this.ruleService.findByFeatureKey(featureKey);
    if (!rules.length) {
      throw new FeatureDoesNotExistException();
    }

    const rulesWithTargetFormatted = this.buildRules(rules);

    return rulesWithTargetFormatted.map((rule) => castWithObfuscation(RuleResponse, rule));
  }

  private buildRules(rules: Rule[]): RuleResponse[] {
    return rules.map((rule) => ({
      ...castWithObfuscation(RuleResponse, rule),
      environment: this.buildEnvironment(rule.environment as Environment) as Environment,
      targets: this.buildTargets(rule.targets as Target[])
    }));
  }

  private buildEnvironment(environment: Environment): EnvironmentResponse {
    return castWithObfuscation(EnvironmentResponse, environment);
  }

  private buildTargets(targets: Target[]): ListTargetResponse[] {
    return targets.map((target) => ({
      ...castWithObfuscation(ListTargetResponse, target),
      variationValue: this.buildVariationValue(target.variationValue as VariationValue)
    }));
  }

  private buildVariationValue(variationValue: VariationValue): VariationValueResponse {
    return castWithObfuscation(VariationValueResponse, variationValue);
  }
}
