import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureAlreadyExistsException } from 'modules/feature/domain/exception/feature-exists';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(FeatureEntity)
    private featureRepository: Repository<FeatureEntity>
  ) {}

  async createFeature(feature: Partial<FeatureEntity>): Promise<FeatureEntity> {
    const hasFeature = await this.findOne({ key: feature.key });
    if (hasFeature) {
      throw new FeatureAlreadyExistsException();
    }

    return this.featureRepository.save(feature);
  }

  async updateAccount(feature: Partial<FeatureEntity>, id: number): Promise<void> {
    await this.featureRepository.update(id, feature);
  }

  async findOne(
    where: FindOptionsWhere<Partial<FeatureEntity>>,
    fields?: FindOptionsSelect<FeatureEntity>
  ): Promise<FeatureEntity> {
    return this.featureRepository.findOne({ where, ...(fields ? { select: fields } : {}) });
  }

  async findByEmail(email: string, fieldsToIncludeInReturn?: string[]): Promise<FeatureEntity> {
    const query = await this.featureRepository
      .createQueryBuilder('features')
      .where('features.email = :email', { email });
    return fieldsToIncludeInReturn ? query.addSelect(fieldsToIncludeInReturn).getOne() : query.getOne();
  }

  async findOneByKeyAndProjectId(key: string, projectId: number): Promise<FeatureEntity> {
    return this.featureRepository
      .createQueryBuilder('features')
      .where('features.key = :key', { key })
      .andWhere('features.project_id = :projectId', { projectId })
      .getOne();
  }

  async findByKeyAndProjectId(projectId: number): Promise<FeatureEntity[]> {
    return this.featureRepository
      .createQueryBuilder('features')
      .where('features.project_id = :projectId', { projectId })
      .getMany();
  }

  async findById(id: number): Promise<FeatureEntity> {
    return this.findOne({ id });
  }

  async find(where: FindOptionsWhere<Partial<FeatureEntity>>): Promise<FeatureEntity[]> {
    return this.featureRepository.find({ where });
  }
}
