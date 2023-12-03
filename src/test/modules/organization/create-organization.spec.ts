import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { OrganizationEntity } from 'modules/organization/domain/organization.entity';
import { EnvironmentEntity } from 'modules/project/domain/environment.entity';
import { SecretEntity } from 'modules/project/domain/secret.entity';
import * as request from 'supertest';
import { AccountOperatarions } from 'test/common/account/account-operations';
import { cleanAll, moduleInit } from 'test/test.utils';
import { Repository } from 'typeorm';

jest.setTimeout(10000);

describe('create-organization', () => {
  let app: INestApplication;
  let httpRequest: request.SuperTest<request.Test>;
  let organizationRepository: Repository<OrganizationEntity>;
  let environmentRepository: Repository<EnvironmentEntity>;
  let accountRepository: Repository<AccountEntity>;
  let secretRepository: Repository<SecretEntity>;
  let token: string;

  beforeAll(async () => {
    app = await moduleInit();

    httpRequest = request(app.getHttpServer());

    organizationRepository = app.get<Repository<OrganizationEntity>>(getRepositoryToken(OrganizationEntity));
    accountRepository = app.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
    environmentRepository = app.get<Repository<EnvironmentEntity>>(getRepositoryToken(EnvironmentEntity));
    secretRepository = app.get<Repository<SecretEntity>>(getRepositoryToken(SecretEntity));
  });

  beforeEach(async () => {
    await AccountOperatarions.createDemoUserAccount(httpRequest);
    token = 'Bearer ' + (await AccountOperatarions.login(httpRequest));
  });

  afterEach(async () => {
    await cleanAll([organizationRepository, accountRepository, environmentRepository, secretRepository]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates new Organization', async () => {
    await httpRequest
      .post('/organizations')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({
        name: 'Organization blue',
        key: 'organization-blue'
      })
      .expect(HttpStatus.CREATED);

    const organizations = await organizationRepository.find({ relations: ['environments'] });
    const secrets = await secretRepository.find();
    expect(organizations).toHaveLength(1);
    expect(organizations[0].environments).toHaveLength(3);
    expect(organizations[0].environments).toMatchObject([
      {
        name: 'Development',
        key: 'development'
      },
      {
        name: 'Staging',
        key: 'staging'
      },
      {
        name: 'Production',
        key: 'production'
      }
    ]);
    expect(secrets).toHaveLength(3);
  });

  it('fails when does NOT have token', async () => {
    await httpRequest
      .post('/organizations')
      .set('Accept', 'application/json')
      .send({
        name: 'Organization blue',
        key: 'organization-blue'
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('fails to create new Organization with existing key', async () => {
    await httpRequest
      .post('/organizations')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({
        name: 'Organization blue',
        key: 'organization-blue'
      })
      .expect(HttpStatus.CREATED);

    const result = await httpRequest
      .post('/organizations')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({
        name: 'Organization blue',
        key: 'organization-blue'
      })
      .expect(HttpStatus.BAD_REQUEST);

    const organizations = await organizationRepository.find();
    expect(organizations).toHaveLength(1);
    expect(result.body.code).toEqual('ORGANIZATION_ALREADY_EXISTS');
  });
});
