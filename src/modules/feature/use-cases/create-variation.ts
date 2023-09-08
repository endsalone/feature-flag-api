import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { VariationValueService } from 'modules/feature/domain/variation-value.service';
import { VariationService } from 'modules/feature/domain/variation.service';
import { CreateVariationRequest } from 'modules/feature/dtos/create-variation.request';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectService } from 'modules/project/domain/project.service';
import { VariationEntity } from '../domain/variation.entity';
import { CreateVariationValueResponse } from '../dtos/create-variation-value.response';
import { CreateVariationResponse } from '../dtos/create-variation.response';

@Injectable()
export class CreateVariation {
  constructor(
    private variationService: VariationService,
    private projectService: ProjectService,
    private variationValueService: VariationValueService
  ) {}

  async execute(slug: string, variation: CreateVariationRequest, account: UserOption): Promise<any> {
    const project = await this.projectService.findOneBySlugAndAccount(`'${slug}'`, account.id);
    if (!project) {
      throw new ProjectDoesNotExistException();
    }

    const variationToCreate: Partial<VariationEntity> = { ...variation, project };
    const createdVariation = await this.variationService.createVariation(variationToCreate);

    const castedVariation: CreateVariationResponse = castWithObfuscation(CreateVariationResponse, createdVariation);
    const castedVariationValue: CreateVariationValueResponse[] = createdVariation.values.map((value) =>
      castWithObfuscation(CreateVariationValueResponse, value)
    );

    return {
      ...castedVariation,
      values: castedVariationValue
    };
  }
}
