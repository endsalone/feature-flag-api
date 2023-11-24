import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Request, UseInterceptors } from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { RuleResponse } from 'modules/feature/dtos/list-rule.response';
import { UpdateRuleRequest } from 'modules/feature/dtos/update-rule.request';
import { GetRule } from 'modules/feature/use-cases/get-rule';
import { ListRule } from 'modules/feature/use-cases/list-rule';
import { UpdateRule } from 'modules/feature/use-cases/update-rule';
import { OrganizationInterceptor } from 'modules/organization/application/orgianization.interceptor';
import { ProjectInterceptor } from 'modules/project/application/project.interceptor';

@Controller('/organizations/:organizationHash/projects/:projectSlug')
@UseInterceptors(OrganizationInterceptor, ProjectInterceptor)
export class RuleController {
  constructor(
    private readonly listRule: ListRule,
    private readonly updateRule: UpdateRule,
    private readonly getRule: GetRule
  ) {}

  @Get('features/:featureKey/rules')
  @HttpCode(HttpStatus.OK)
  async list(@Param('featureKey') featureKey: string): Promise<RuleResponse[]> {
    return this.listRule.execute(featureKey);
  }

  @Get('features/:featureKey/rules/:ruleId')
  @HttpCode(HttpStatus.OK)
  async get(@Param('featureKey') featureKey: string, @Param('ruleId') ruleId: number): Promise<RuleResponse> {
    return this.getRule.execute(featureKey, ruleId);
  }

  @Put('features/:featureKey/rules')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('ruleId') ruleId: string,
    @Body() rule: UpdateRuleRequest,
    @Request() options: RequestOptions
  ): Promise<unknown> {
    return this.updateRule.execute(rule, options.user);
  }
}
