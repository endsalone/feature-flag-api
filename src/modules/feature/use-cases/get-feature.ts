import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { FeatureDoesNotExistException } from 'modules/feature/domain/exception/feature-does-not-exists';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { FeatureWithVariations } from 'modules/feature/domain/feature.type';
import { CreateFeatureResponse } from 'modules/feature/dtos/create-feature.response';
import { CreateVariationValueResponse } from 'modules/feature/dtos/create-variation-value.response';
import { CreateVariationResponse } from 'modules/feature/dtos/create-variation.response';
import { ProjectService } from 'modules/project/domain/project.service';
import { FeatureEntity } from '../domain/feature.entity';

@Injectable()
export class GetFeature {
  constructor(private projectService: ProjectService, private featureService: FeatureService) {}

  async execute(projectSlug: string, featureKey: string, account: UserOption): Promise<unknown> {
    const project = await this.projectService.findOneBySlugAndAccount(`'${projectSlug}'`, account.id);
    if (!project) {
      throw new Error('Project not found');
    }

    const featureFromProject: FeatureEntity = await this.featureService.findOne({ key: featureKey, project }, null, [
      'variations',
      'variations.values'
    ]);
    if (!featureFromProject) {
      throw new FeatureDoesNotExistException();
    }

    return this.formatFeature(featureFromProject);
  }

  private formatFeature(feature: FeatureEntity): FeatureWithVariations {
    const castedFeature = castWithObfuscation(CreateFeatureResponse, feature);
    const castedVariations = feature.variations.map((variation) => ({
      ...castWithObfuscation(CreateVariationResponse, variation),
      values: variation.values.map((value) => castWithObfuscation(CreateVariationValueResponse, value))
    }));
    return { ...castedFeature, variations: castedVariations };
  }
}
