import { Injectable } from '@nestjs/common';
import { castWithoutObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { VariationValueService } from 'modules/feature/domain/variation-value.service';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationService } from 'modules/feature/domain/variation.service';
import { UpdateVariationRequest } from 'modules/feature/dtos/update-variation.request'; // Você precisa criar este DTO.
import { VariationValueEntity } from '../domain/variation-value.entity';

@Injectable()
export class UpdateVariation {
  constructor(private variationService: VariationService, private variationValueService: VariationValueService) {}

  async execute(updateVariationDto: UpdateVariationRequest, options: UserOption): Promise<VariationEntity> {
    const existingVariation = await this.variationService.findOne({ key: updateVariationDto.key });
    if (!existingVariation) {
      throw new Error('Variation with given key does NOT exist.');
    }
    for (const valueDto of updateVariationDto.values) {
      if (!valueDto.id) {
        const savedVariationValue = await this.variationValueService.createVariationValue({
          value: valueDto.value
        });
        const variationValue = castWithoutObfuscation(VariationValueEntity, savedVariationValue);
        existingVariation.values.push(variationValue);

        continue;
      }

      const variationValue = existingVariation.values.find((value) => value.id === valueDto.id);
      if (variationValue.value !== valueDto.value) {
        variationValue.value = valueDto.value;
        await this.variationValueService.update(variationValue);
      }
    }

    return this.variationService.update(existingVariation);
  }
}
