import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { FeatureDoesNotExistException } from 'modules/feature/domain/exception/feature-does-not-exist';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { FeatureWithVariations } from 'modules/feature/domain/feature.type';
import { CreateFeatureResponse } from 'modules/feature/dtos/create-feature.response';
import { CreateVariationResponse } from 'modules/feature/dtos/create-variation.response';
import { VariationValueResponse } from 'modules/feature/dtos/variation-value.response';
import { ProjectService } from 'modules/project/domain/project.service';
import { EnvironmentResponse } from 'modules/project/dtos/environment.response';

@Injectable()
export class GetFeature {
  constructor(private projectService: ProjectService, private featureService: FeatureService) {}

  async execute(projectSlug: string, featureKey: string, account: UserOption): Promise<FeatureWithVariations> {
    const project = account.project;

    const featureFromProject: FeatureEntity = await this.featureService.findOne(
      { key: featureKey, project: { id: project.id } },
      null,
      ['variations', 'variations.values']
    );
    if (!featureFromProject) {
      throw new FeatureDoesNotExistException();
    }

    const environments = project.environments.map((env) => ({
      ...castWithObfuscation(EnvironmentResponse, env)
    }));
    const featureFromProjectWithProject = { ...featureFromProject, environments };

    return this.formatFeature(featureFromProjectWithProject);
  }

  private formatFeature(feature: FeatureEntity): FeatureWithVariations {
    const castedFeature = castWithObfuscation(CreateFeatureResponse, feature);
    const castedVariations = feature.variations.map((variation) => ({
      ...castWithObfuscation(CreateVariationResponse, variation),
      values: variation.values.map((value) => castWithObfuscation(VariationValueResponse, value))
    }));
    return { ...castedFeature, variations: castedVariations };
  }
}
