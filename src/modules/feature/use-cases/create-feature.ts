import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { FeatureAlreadyExistsException } from 'modules/feature/domain/exception/feature-exists';
import { VariationAlreadyExistsException } from 'modules/feature/domain/exception/variation-exists';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { FeatureWithVariations } from 'modules/feature/domain/feature.type';
import { VariationService } from 'modules/feature/domain/variation.service';
import { CreateFeatureRequest } from 'modules/feature/dtos/create-feature.request';
import { CreateFeatureResponse } from 'modules/feature/dtos/create-feature.response';
import { CreateVariationResponse } from 'modules/feature/dtos/create-variation.response';
import { VariationValueResponse } from 'modules/feature/dtos/variation-value.response';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectEntity } from 'modules/project/domain/project.entity';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class CreateFeature {
  constructor(
    private projectService: ProjectService,
    private featureService: FeatureService,
    private variationService: VariationService
  ) {}

  async execute(slug: string, feature: CreateFeatureRequest, account: UserOption): Promise<FeatureWithVariations> {
    const project: ProjectEntity = await this.projectService.findOneBySlugAndAccount(`'${slug}'`, account.id);
    if (!project) {
      throw new ProjectDoesNotExistException();
    }

    const hasFeature = await this.featureService.findOne({ key: feature.key });
    if (hasFeature) {
      throw new FeatureAlreadyExistsException();
    }

    const hasVariation = await this.variationService.findOne({ key: feature.variation.key });
    if (hasVariation) {
      throw new VariationAlreadyExistsException();
    }

    const createdVariation = await this.variationService.createVariation({
      ...feature.variation,
      project
    });

    const featureToCreate: Partial<FeatureEntity> = {
      ...feature,
      project,
      variations: [createdVariation]
    };
    const createdFeature = await this.featureService.createFeature(featureToCreate);

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
}
