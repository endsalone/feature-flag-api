import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { VariationValueService } from 'modules/feature/domain/variation-value.service';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationService } from 'modules/feature/domain/variation.service';
import { CreateVariationRequest } from 'modules/feature/dtos/create-variation.request';
import { CreateVariationResponse } from 'modules/feature/dtos/create-variation.response';
import { VariationValueResponse } from 'modules/feature/dtos/variation-value.response';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class CreateVariation {
  constructor(
    private variationService: VariationService,
    private projectService: ProjectService,
    private variationValueService: VariationValueService
  ) {}

  async execute(
    slug: string,
    variation: CreateVariationRequest,
    account: UserOption
  ): Promise<CreateVariationResponse> {
    const project = await this.projectService.findOneBySlugAndAccountAndOrganization(
      `'${slug}'`,
      account.id,
      account.organization.id
    );
    if (!project) {
      throw new ProjectDoesNotExistException();
    }

    const variationToCreate: Partial<VariationEntity> = { ...variation, project };
    const createdVariation = await this.variationService.createVariation(variationToCreate);

    const castedVariation: CreateVariationResponse = castWithObfuscation(CreateVariationResponse, createdVariation);
    const castedVariationValue: VariationValueResponse[] = createdVariation.values.map((value) =>
      castWithObfuscation(VariationValueResponse, value)
    );

    return {
      ...castedVariation,
      values: castedVariationValue
    };
  }
}
