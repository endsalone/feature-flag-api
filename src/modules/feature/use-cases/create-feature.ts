import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { FeatureAlreadyExistsException } from 'modules/feature/domain/exception/feature-exists';
import { Feature } from 'modules/feature/domain/feature';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { FeatureWithVariations } from 'modules/feature/domain/feature.type';
import { Rule } from 'modules/feature/domain/rule';
import { RuleService } from 'modules/feature/domain/rule.service';
import { DefinitionEnum } from 'modules/feature/domain/target.type';
import { Variation } from 'modules/feature/domain/variation';
import { VariationValue } from 'modules/feature/domain/variation-value';
import { VariationService } from 'modules/feature/domain/variation.service';
import { CreateFeatureRequest } from 'modules/feature/dtos/create-feature.request';
import { CreateFeatureResponse } from 'modules/feature/dtos/create-feature.response';
import { CreateVariationResponse } from 'modules/feature/dtos/create-variation.response';
import { VariationValueResponse } from 'modules/feature/dtos/variation-value.response';
import { Environment } from 'modules/organization/domain/environment';
import { DefaultEnvironment } from 'modules/organization/domain/environment.type';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectEntity } from 'modules/project/domain/project.entity';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class CreateFeature {
  constructor(
    private projectService: ProjectService,
    private featureService: FeatureService,
    private variationService: VariationService,
    private ruleService: RuleService
  ) {}

  async execute(slug: string, feature: CreateFeatureRequest, account: UserOption): Promise<FeatureWithVariations> {
    const project: ProjectEntity = await this.projectService.findOneBySlugAndAccountAndOrganization(
      `'${slug}'`,
      account.id,
      account.organization.id
    );
    if (!project) {
      throw new ProjectDoesNotExistException();
    }

    const hasFeature = await this.featureService.findOne({ key: feature.key });
    if (hasFeature) {
      throw new FeatureAlreadyExistsException();
    }

    const createdVariation: Variation = await this.variationService.createVariation({
      ...feature.variation,
      project
    });

    const featureToCreate: Partial<FeatureEntity> = {
      ...feature,
      project,
      variations: [createdVariation]
    };
    const createdFeature = await this.featureService.createFeature(featureToCreate);

    const rulesToCreate = this.buildDefaultRules(account, createdVariation, createdFeature);
    await this.ruleService.createDefaultRulesWithTarget(rulesToCreate);

    const castedFeature: CreateFeatureResponse = castWithObfuscation(CreateFeatureResponse, createdFeature);
    const castedVariation: CreateVariationResponse = castWithObfuscation(CreateVariationResponse, createdVariation);
    const castedVariationValue: VariationValueResponse[] = createdVariation.values.map((value) =>
      castWithObfuscation(VariationValueResponse, value)
    );

    return {
      ...castedFeature,
      variations: [{ ...castedVariation, values: castedVariationValue }]
    };
  }

  private buildDefaultRules(account: UserOption, variation: Variation, feature: Feature): Partial<Rule>[] {
    const environments: Environment[] = account.organization.environments;
    const defaultRulesByEnvironment: Omit<Rule, 'id'>[] = [];

    for (const environment of environments) {
      const isDeveloptmentEnvironment = environment.name === DefaultEnvironment.DEVELOPMENT;
      defaultRulesByEnvironment.push({
        active: isDeveloptmentEnvironment,
        feature,
        environment,
        targets: [
          {
            name: 'All users',
            definitionProperty: DefinitionEnum.ALL_USERS,
            definitionComparator: null,
            definitionValue: null,
            variationValue: variation.values[0] as VariationValue
          }
        ]
      });
    }

    return defaultRulesByEnvironment;
  }
}
