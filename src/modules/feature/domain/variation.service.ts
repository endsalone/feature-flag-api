import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VariationAlreadyExistsException } from 'modules/feature/domain/exception/variation-exists';
import { VariationValueEntity } from 'modules/feature/domain/variation-value.entity';
import { VariationValueService } from 'modules/feature/domain/variation-value.service';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationType } from 'modules/feature/domain/variation.type';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class VariationService {
  constructor(
    @InjectRepository(VariationEntity)
    private variationRepository: Repository<VariationEntity>,
    private variationValueService: VariationValueService
  ) {}

  async save(variation: VariationEntity): Promise<VariationEntity> {
    return this.variationRepository.save(variation);
  }

  async createVariation(variation: Partial<VariationEntity>): Promise<VariationEntity> {
    const existingVariation = await this.findOne({ key: variation.key });
    if (existingVariation) {
      throw new VariationAlreadyExistsException();
    }

    const variationValuesPartial = this.buildVariationValues(variation.type);
    const createdVariationValues = await this.variationValueService.createVariationValue(variationValuesPartial);
    const variationToCreate: Partial<VariationEntity> = {
      ...variation,
      values: createdVariationValues as VariationValueEntity[]
    };

    return this.variationRepository.save(variationToCreate);
  }

  async findOne(where: FindOptionsWhere<Partial<VariationEntity>>, fields?: string[]): Promise<VariationEntity> {
    return this.variationRepository
      .createQueryBuilder('variation')
      .where(where)
      .leftJoinAndSelect('variation.values', 'values')
      .select(fields)
      .getOne();
  }

  async update(variationUpdate: Partial<VariationEntity>): Promise<VariationEntity> {
    if (!variationUpdate.id) {
      throw new Error('Variation ID must be provided for update.');
    }

    const existingVariation = await this.findOne({ id: variationUpdate.id });
    if (!existingVariation) {
      throw new Error('Variation not found.');
    }

    // Update variation fields
    existingVariation.key = variationUpdate.key ?? existingVariation.key;
    existingVariation.description = variationUpdate.description ?? existingVariation.description;
    existingVariation.type = variationUpdate.type ?? existingVariation.type;

    // Handle the update or creation of variation values
    for (const value of variationUpdate.values || []) {
      if (value.id) {
        // Update existing value
        const existingValue = existingVariation.values.find((v) => v.id === value.id);
        if (existingValue) {
          existingValue.value = value.value;
          await this.variationValueService.update(existingValue);
        }
      } else {
        // Create new value and add to variation values
        const newValue = await this.variationValueService.createVariationValue(value);
        existingVariation.values.push(newValue as VariationValueEntity);
      }
    }

    return this.variationRepository.save(existingVariation);
  }

  private buildVariationValues(type: VariationType): Partial<VariationValueEntity>[] {
    switch (type) {
      case 'boolean':
        return [{ value: true }, { value: false }];
      case 'string':
        return [{ value: 'stringA' }, { value: 'stringB' }];
      case 'number':
        return [{ value: 1 }, { value: 2 }];
    }
  }
}
