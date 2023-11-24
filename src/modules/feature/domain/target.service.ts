import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TargetEntity } from 'modules/feature/domain/target.entity';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TargetService {
  constructor(
    @InjectRepository(TargetEntity)
    private targetRepository: Repository<TargetEntity>
  ) {}

  async createTarget(
    variation: Partial<TargetEntity> | Partial<TargetEntity>[]
  ): Promise<TargetEntity | TargetEntity[]> {
    return this.targetRepository.save(variation as TargetEntity[]);
  }

  async findOne(
    where: FindOptionsWhere<Partial<TargetEntity>>,
    fields?: FindOptionsSelect<TargetEntity>
  ): Promise<TargetEntity> {
    return this.targetRepository.findOne({ where, ...(fields ? { select: fields } : {}) });
  }

  async find(
    where: FindOptionsWhere<Partial<TargetEntity>>,
    fields?: FindOptionsSelect<TargetEntity>
  ): Promise<TargetEntity[]> {
    return this.targetRepository.find({ where, ...(fields ? { select: fields } : {}) });
  }

  async update(target: TargetEntity): Promise<TargetEntity> {
    return this.targetRepository.save(target);
  }

  async updateMany(target: TargetEntity[]): Promise<TargetEntity[]> {
    return this.targetRepository.save(target);
  }

  async delete(id: typeof TargetEntity.prototype.id): Promise<void> {
    await this.targetRepository.delete(id);
  }
}
