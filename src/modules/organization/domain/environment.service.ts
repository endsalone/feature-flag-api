import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvironmentEntity } from 'modules/organization/domain/environment.entity';
import { DefaultEnvironment } from 'modules/organization/domain/environment.type';
import { Repository } from 'typeorm';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectRepository(EnvironmentEntity)
    private environmentRepository: Repository<EnvironmentEntity>
  ) {}

  async createDefault(): Promise<EnvironmentEntity[]> {
    const environments: EnvironmentEntity[] = [];
    for (const env of Object.values(DefaultEnvironment)) {
      const environment = await this.environmentRepository.save({ name: env, key: env });
      environments.push(environment);
    }

    return this.environmentRepository.save(environments);
  }
}
