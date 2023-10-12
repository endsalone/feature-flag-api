import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { OrganizationAlreadyExistsException } from 'modules/organization/domain/exception/organization-exists';
import { OrganizationEntity } from 'modules/organization/domain/organization.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EnvironmentService } from './environment.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,
    private readonly environmentService: EnvironmentService
  ) {}

  async createOrganization(organization: OrganizationEntity, accountId: number): Promise<OrganizationEntity> {
    const hasOriganization = await this.findOneBySlugAndAccount(`'${organization.key}'`, accountId);
    if (hasOriganization) {
      throw new OrganizationAlreadyExistsException();
    }

    const environments = await this.environmentService.createDefault();

    const account = new AccountEntity();
    account.id = accountId;

    const hash = await this.generateHash(organization.key);

    const oraganizationWithSlug: OrganizationEntity = { ...organization, hash, permissions: [account], environments };
    return this.organizationRepository.save(oraganizationWithSlug);
  }

  async updateOrganization(
    organization: Partial<OrganizationEntity>,
    accountId: number
  ): Promise<Partial<OrganizationEntity>> {
    const hasOrganization = await this.findOneBySlugAndAccount(`'${organization.key}'`, accountId);
    if (!hasOrganization) {
      throw new OrganizationAlreadyExistsException();
    }

    const firstOrganization = {
      ...hasOrganization,
      ...organization
    };

    await this.organizationRepository.save(firstOrganization);

    return firstOrganization;
  }

  async findOneBySlugAndAccount(key: string, accountId: number): Promise<OrganizationEntity> {
    const query = this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.permissions', 'permissions')
      .where(`organization.key = ${key}`)
      .andWhere(`permissions.id = ${accountId}`);

    return query.getOne();
  }

  async findManyByAccount(accountId: number): Promise<OrganizationEntity[]> {
    const query = await this.getOrganizationQuery(accountId);
    return query.getMany();
  }

  async findOneByHashAndAccount(hash: string, accountId: number): Promise<OrganizationEntity> {
    const query = await this.getOrganizationQuery(accountId);
    query.andWhere(`organization.hash = '${hash}'`);

    return query.getOne();
  }

  private async generateHash(key: string): Promise<string> {
    const hash = `${key}-${Math.random().toString(36).substr(2, 9)}`;

    const hasHash = await this.organizationRepository.findOne({ where: { hash } });
    if (hasHash) {
      return this.generateHash(key);
    }

    return hash;
  }

  private async getOrganizationQuery(accountId: number): Promise<SelectQueryBuilder<OrganizationEntity>> {
    return this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.permissions', 'permissions')
      .where(`permissions.id = ${accountId}`)
      .orderBy('organization.name', 'ASC');
  }
}
