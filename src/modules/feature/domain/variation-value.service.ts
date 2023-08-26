import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VariationValueEntity } from 'modules/feature/domain/variation-value.entity';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class VariationValueService {
  constructor(
    @InjectRepository(VariationValueEntity)
    private variationRepository: Repository<VariationValueEntity>
  ) {}

  async createVariationValue(
    feature: Partial<VariationValueEntity> | Partial<VariationValueEntity>[]
  ): Promise<VariationValueEntity | VariationValueEntity[]> {
    return this.variationRepository.save(feature as VariationValueEntity[]);
  }

  async findOne(
    where: FindOptionsWhere<Partial<VariationValueEntity>>,
    fields?: FindOptionsSelect<VariationValueEntity>
  ): Promise<VariationValueEntity> {
    return this.variationRepository.findOne({ where, ...(fields ? { select: fields } : {}) });
  }
}
