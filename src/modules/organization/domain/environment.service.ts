import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hash } from 'common/hash';
import { EnvironmentEntity } from 'modules/organization/domain/environment.entity';
import { DefaultEnvironment } from 'modules/organization/domain/environment.type';
import { Repository } from 'typeorm';
import { SecretEntity } from './secret.entity';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectRepository(EnvironmentEntity)
    private environmentRepository: Repository<EnvironmentEntity>,
    @InjectRepository(SecretEntity)
    private secretRepository: Repository<SecretEntity>
  ) {}

  async createDefault(): Promise<EnvironmentEntity[]> {
    const environments: EnvironmentEntity[] = [];
    for (const env of Object.values(DefaultEnvironment)) {
      const name = env.charAt(0).toUpperCase() + env.slice(1);

      const server = Hash.generateRandomHash(32, 'server-');
      const client = Hash.generateRandomHash(32, 'client-');
      const mobile = Hash.generateRandomHash(32, 'mobile-');

      const secret = await this.secretRepository.save({ server, client, mobile });
      const environment = await this.environmentRepository.save({ name, key: env, secret });

      environments.push(environment);
    }

    return this.environmentRepository.save(environments);
  }
}
