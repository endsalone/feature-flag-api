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

@Injectable()
export class GetFeature {
  constructor(private projectService: ProjectService, private featureService: FeatureService) {}

  async execute(projectSlug: string, featureKey: string, account: UserOption): Promise<FeatureWithVariations> {
    const project = await this.projectService.findOneBySlugAndAccountAndOrganization(
      `'${projectSlug}'`,
      account.id,
      account.organization.id
    );
    if (!project) {
      throw new Error('Project not found');
    }

    const featureFromProject: FeatureEntity = await this.featureService.findOne(
      { key: featureKey, project: { id: project.id } },
      null,
      ['project', 'variations', 'variations.values']
    );
    if (!featureFromProject) {
      throw new FeatureDoesNotExistException();
    }

    return this.formatFeature(featureFromProject);
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
