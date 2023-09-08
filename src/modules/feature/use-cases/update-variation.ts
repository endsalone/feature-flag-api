import { Injectable } from '@nestjs/common';
import { VariationValueService } from 'modules/feature/domain/variation-value.service';
import { VariationService } from 'modules/feature/domain/variation.service';
import { UpdateVariationRequest } from 'modules/feature/dtos/update-variation.request'; // Você precisa criar este DTO.
import { VariationValueEntity } from '../domain/variation-value.entity';
import { VariationEntity } from '../domain/variation.entity';

@Injectable()
export class UpdateVariation {
  constructor(private variationService: VariationService, private variationValueService: VariationValueService) {}

  async execute(updateVariationDto: UpdateVariationRequest): Promise<VariationEntity> {
    const existingVariation = await this.variationService.findOne({ key: updateVariationDto.key });
    if (!existingVariation) {
      throw new Error('Variation with given key does NOT exist.');
    }

    for (const valueDto of updateVariationDto.values) {
      let variationValue: VariationValueEntity;

      // Se um ID é fornecido, procure por esse ID.
      if (valueDto.id) {
        variationValue = existingVariation.values.find((value) => value.id === valueDto.id);
      }

      // Se o VariationValue não for encontrado ou não houver ID fornecido, crie um novo.
      if (!variationValue) {
        variationValue = (await this.variationValueService.createVariationValue({
          value: valueDto.value
        })) as VariationValueEntity;
        existingVariation.values.push(variationValue as VariationValueEntity);
      } else {
        // Caso contrário, atualize o valor se ele for diferente.
        if (variationValue.value !== valueDto.value) {
          variationValue.value = valueDto.value;
          await this.variationValueService.update(variationValue); // Supondo que você tenha um método de atualização.
        }
      }
    }

    return this.variationService.update(existingVariation); // Supondo que você tenha um método de atualização.
  }
}
