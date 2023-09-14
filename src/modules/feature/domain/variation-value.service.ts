import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VariationValueEntity } from 'modules/feature/domain/variation-value.entity';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class VariationValueService {
  constructor(
    @InjectRepository(VariationValueEntity)
    private variationValueRepository: Repository<VariationValueEntity>
  ) {}

  async createVariationValue(
    variation: Partial<VariationValueEntity> | Partial<VariationValueEntity>[]
  ): Promise<VariationValueEntity | VariationValueEntity[]> {
    return this.variationValueRepository.save(variation as VariationValueEntity[]);
  }

  async findOne(
    where: FindOptionsWhere<Partial<VariationValueEntity>>,
    fields?: FindOptionsSelect<VariationValueEntity>
  ): Promise<VariationValueEntity> {
    return this.variationValueRepository.findOne({ where, ...(fields ? { select: fields } : {}) });
  }

  async find(
    where: FindOptionsWhere<Partial<VariationValueEntity>>,
    fields?: FindOptionsSelect<VariationValueEntity>
  ): Promise<VariationValueEntity[]> {
    return this.variationValueRepository.find({ where, ...(fields ? { select: fields } : {}) });
  }

  async update(variationValue: VariationValueEntity): Promise<VariationValueEntity> {
    return this.variationValueRepository.save(variationValue);
  }
}
