import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureAlreadyExistsException } from 'modules/feature/domain/exception/feature-exists';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class VariationService {
  constructor(
    @InjectRepository(VariationEntity)
    private variationRepository: Repository<VariationEntity>
  ) {}

  async createVariation(feature: Partial<VariationEntity>): Promise<VariationEntity> {
    const hasFeature = await this.findOne({ key: feature.key });
    if (hasFeature) {
      throw new FeatureAlreadyExistsException();
    }

    return this.variationRepository.save(feature);
  }

  async findOne(
    where: FindOptionsWhere<Partial<VariationEntity>>,
    fields?: FindOptionsSelect<VariationEntity>
  ): Promise<VariationEntity> {
    return this.variationRepository.findOne({ where, ...(fields ? { select: fields } : {}) });
  }
}
