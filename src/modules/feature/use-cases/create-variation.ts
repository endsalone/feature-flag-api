import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { VariationAlreadyExistsException } from 'modules/feature/domain/exception/variation-exists';
import { VariationTypeInvalidException } from 'modules/feature/domain/exception/variation-type-invalid';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationService } from 'modules/feature/domain/variation.service';
import { VariationType } from 'modules/feature/domain/variation.type';
import { CreateFeatureResponse } from 'modules/feature/dtos/create-feature.response';
import { CreateVariationRequest } from 'modules/feature/dtos/create-variation.request';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class CreateVariation {
  constructor(private variationService: VariationService, private projectService: ProjectService) {}

  async execute(slug: string, feature: CreateVariationRequest, account: UserOption): Promise<unknown> {
    const projectList = await this.projectService.findBySlugsAndAccount(`'${slug}'`, account.id);
    if (!projectList.length) {
      throw new ProjectDoesNotExistException();
    }

    const hasVariation = await this.variationService.findOne({ key: feature.key });
    if (hasVariation) {
      throw new VariationAlreadyExistsException();
    }

    const isValidVariationType = Object.values(VariationType).includes(feature.type);
    if (!isValidVariationType) {
      throw new VariationTypeInvalidException();
    }

    const variationToCreate: Partial<VariationEntity> = {
      ...feature,
      project: projectList[0]
    };
    const createdVariation = await this.variationService.createVariation(variationToCreate);

    return castWithObfuscation(CreateFeatureResponse, createdVariation);
  }
}
