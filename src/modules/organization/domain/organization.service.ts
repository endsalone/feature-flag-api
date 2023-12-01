import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hash } from 'common/hash';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { EnvironmentService } from 'modules/organization/domain/environment.service';
import { OrganizationAlreadyExistsException } from 'modules/organization/domain/exception/organization-exists';
import { OrganizationEntity } from 'modules/organization/domain/organization.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
    const apiId = Hash.generateRandomHash(16);
    const apiSecret = Hash.generateRandomHash(24);
    const oraganizationWithSlug: OrganizationEntity = {
      ...organization,
      hash,
      apiId,
      apiSecret,
      permissions: [account],
      environments
    };
    return this.organizationRepository.save(oraganizationWithSlug);
  }

  async updateOrganization(organization: Partial<OrganizationEntity>): Promise<Partial<OrganizationEntity>> {
    return this.organizationRepository.save(organization);
  }

  async findOneBySlugAndAccount(key: string, accountId: number): Promise<OrganizationEntity> {
    const query = this.organizationRepository
      .createQueryBuilder('organization')
      .innerJoinAndSelect('organization.permissions', 'permissions')
      .where(`organization.key IN (${key})`)
      .andWhere(`permissions.id = ${accountId}`);

    return query.getOne();
  }

  async findManyByAccount(accountId: number): Promise<OrganizationEntity[]> {
    const query = await this.getOrganizationQuery(accountId);
    return query.getMany();
  }

  async findOneById(id: number): Promise<OrganizationEntity> {
    return this.organizationRepository.findOneOrFail({ where: { id } });
  }

  async findOneByHashAndAccount(organizationHash: string, accountId: number): Promise<OrganizationEntity> {
    const query = await this.getOrganizationQuery(accountId, organizationHash);
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

  private async getOrganizationQuery(
    accountId: number,
    organizationHash?: string
  ): Promise<SelectQueryBuilder<OrganizationEntity>> {
    const whereClause = organizationHash
      ? `organization.hash = '${organizationHash}'`
      : `permissions.id = ${accountId}`;

    return this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.permissions', 'permissions')
      .where(whereClause)
      .leftJoinAndSelect('organization.environments', 'environments')
      .leftJoinAndSelect('environments.secret', 'secret')
      .orderBy('organization.name', 'ASC');
  }
}
