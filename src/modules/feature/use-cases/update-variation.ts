import { Injectable } from '@nestjs/common';
import { castWithObfuscation, castWithoutObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { VariationDoesNotExistException } from 'modules/feature/domain/exception/variation-does-not-exist';
import { VariationIdFromAnother } from 'modules/feature/domain/exception/variation-id-from-another';
import { VariationValueEntity } from 'modules/feature/domain/variation-value.entity';
import { VariationValueService } from 'modules/feature/domain/variation-value.service';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationService } from 'modules/feature/domain/variation.service';
import { GetVariationResponse } from 'modules/feature/dtos/get-variation.response';
import { UpdateVariationRequest } from 'modules/feature/dtos/update-variation.request';
import { VariationValueResponse } from 'modules/feature/dtos/variation-value.response';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class UpdateVariation {
  constructor(
    private variationService: VariationService,
    private variationValueService: VariationValueService,
    private projectService: ProjectService
  ) {}

  async execute(
    updateVariationDto: UpdateVariationRequest,
    projectSlug: string,
    account?: UserOption
  ): Promise<GetVariationResponse> {
    const project = await this.projectService.findOneBySlugAndAccount(`'${projectSlug}'`, account.id);
    if (!project) {
      throw new ProjectDoesNotExistException();
    }

    const existingVariation = await this.variationService.findOne({ key: updateVariationDto.key });
    if (!existingVariation) {
      throw new VariationDoesNotExistException();
    }

    const existingVariationValuesIds = existingVariation.values.map((v) => v.id);
    const hasVariationValuesFromAnotherVariation = updateVariationDto.values.some(
      (value) => value.id && !existingVariationValuesIds.includes(value.id)
    );
    if (hasVariationValuesFromAnotherVariation) {
      throw new VariationIdFromAnother();
    }

    const variationFiltered = await this.deleteVariationValues(existingVariation, updateVariationDto);

    await this.updateVariationValues(variationFiltered, updateVariationDto);

    const updatedVariation = await this.variationService.update(variationFiltered);

    const variation = castWithObfuscation(GetVariationResponse, updatedVariation);
    const variationValues = updatedVariation.values.map((value) => castWithObfuscation(VariationValueResponse, value));

    return {
      ...variation,
      values: variationValues
    };
  }

  private async deleteVariationValues(
    existingVariation: VariationEntity,
    updateVariationDto: UpdateVariationRequest
  ): Promise<VariationEntity> {
    const providedValueIds = updateVariationDto.values.map((v) => v.id).filter((id) => id !== undefined);

    for (const existingValue of existingVariation.values) {
      const doesNotHaveProvidedValue = !providedValueIds.includes(existingValue.id);
      if (doesNotHaveProvidedValue) {
        await this.variationValueService.delete(existingValue.id);

        const filtered = existingVariation.values.filter((value) => value.id !== existingValue.id);
        existingVariation.values = filtered;
      }
    }

    return {
      ...existingVariation,
      key: updateVariationDto.key,
      description: updateVariationDto.description,
      type: updateVariationDto.type
    };
  }

  private async updateVariationValues(
    variationFiltered: VariationEntity,
    updateVariationDto: UpdateVariationRequest
  ): Promise<VariationEntity> {
    for (const valueDto of updateVariationDto.values) {
      if (!valueDto.id) {
        const savedVariationValue = await this.variationValueService.createVariationValue({
          value: valueDto.value
        });
        const variationValue = castWithoutObfuscation(VariationValueEntity, savedVariationValue);

        variationFiltered.values.push(variationValue);

        await this.variationService.save(variationFiltered);
        continue;
      }

      const variationValue = variationFiltered.values.find((value) => value.id === valueDto.id);
      if (variationValue.value !== valueDto.value) {
        variationValue.value = valueDto.value;
        await this.variationValueService.update(variationValue);
      }
    }

    return variationFiltered;
  }
}
