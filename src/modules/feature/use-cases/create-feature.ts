import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { FeatureAlreadyExistsException } from 'modules/feature/domain/exception/feature-exists';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { FeatureWithVariations } from 'modules/feature/domain/feature.type';
import { VariationValueEntity } from 'modules/feature/domain/variation-value.entity';
import { VariationValueService } from 'modules/feature/domain/variation-value.service';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationService } from 'modules/feature/domain/variation.service';
import { CreateFeatureRequest } from 'modules/feature/dtos/create-feature.request';
import { CreateFeatureResponse } from 'modules/feature/dtos/create-feature.response';
import { CreateVariationValueResponse } from 'modules/feature/dtos/create-variation-value.response';
import { CreateVariationResponse } from 'modules/feature/dtos/create-variation.response';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectEntity } from 'modules/project/domain/project.entity';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class CreateFeature {
  constructor(
    private projectService: ProjectService,
    private featureService: FeatureService,
    private variationService: VariationService,
    private variationValueService: VariationValueService
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

    const variationValuesPartial = this.buildVariationValues(feature);
    const createdVariationValues = await this.variationValueService.createVariationValue(variationValuesPartial);

    const variationToCreate = this.buildVariation(
      feature.variation,
      createdVariationValues as VariationValueEntity[],
      project
    );
    const createdVariation = await this.variationService.createVariation(variationToCreate);

    const featureToCreate: Partial<FeatureEntity> = { ...feature, project, variations: [createdVariation] };
    const createdFeature = await this.featureService.createFeature(featureToCreate);

    const castedFeature: CreateFeatureResponse = castWithObfuscation(CreateFeatureResponse, createdFeature);
    const castedVariation: CreateVariationResponse = castWithObfuscation(CreateVariationResponse, createdVariation);
    const castedVariationValues: CreateVariationValueResponse[] = (
      createdVariationValues as VariationValueEntity[]
    ).map((variationValue) => castWithObfuscation(CreateVariationValueResponse, variationValue));

    return {
      ...castedFeature,
      variations: [{ ...castedVariation, values: castedVariationValues }]
    };
  }

  private buildVariation(
    variation: Partial<VariationEntity>,
    variationValues: VariationValueEntity[],
    project: ProjectEntity
  ): Partial<VariationEntity> {
    return { ...variation, values: variationValues, project };
  }

  private buildVariationValues(feature: CreateFeatureRequest): Partial<VariationValueEntity>[] {
    switch (feature.variation.type) {
      case 'boolean':
        return [{ value: true }, { value: false }];
      case 'string':
        return [{ value: 'stringA' }, { value: 'stringB' }];
      case 'number':
        return [{ value: 1 }, { value: 2 }];
    }
  }
}
