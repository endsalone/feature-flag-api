import { Injectable } from '@nestjs/common';
import { UserOption } from 'common/user-type';
import { RuleDoesNotExistException } from 'modules/feature/domain/exception/rule-does-not-exist';
import { RuleEntity } from 'modules/feature/domain/rule.entity';
import { RuleService } from 'modules/feature/domain/rule.service';
import { TargetEntity } from 'modules/feature/domain/target.entity';
import { TargetService } from 'modules/feature/domain/target.service';
import { UpdateRuleRequest } from 'modules/feature/dtos/update-rule.request';

@Injectable()
export class UpdateRule {
  constructor(private ruleService: RuleService, private targetService: TargetService) {}

  async execute(newRule: UpdateRuleRequest, account: UserOption): Promise<void> {
    const existentRule = await this.ruleService.getRuleById(newRule.id, account.project.id);
    if (!existentRule) {
      throw new RuleDoesNotExistException();
    }

    await this.ruleService.update(newRule as RuleEntity);

    await this.targetService.updateMany(newRule.targets as TargetEntity[]);

    return;
  }
}
