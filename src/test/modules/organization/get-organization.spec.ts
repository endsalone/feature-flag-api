import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { OrganizationEntity } from 'modules/organization/domain/organization.entity';
import * as request from 'supertest';
import { AccountOperatarions } from 'test/common/account/account-operations';
import { cleanAll, moduleInit } from 'test/test.utils';
import { Repository } from 'typeorm';

jest.setTimeout(10000);

describe('get-organization', () => {
  let app: INestApplication;
  let httpRequest: request.SuperTest<request.Test>;
  let organizationRepository: Repository<OrganizationEntity>;
  let accountRepository: Repository<AccountEntity>;
  let token: string;

  beforeAll(async () => {
    app = await moduleInit();

    httpRequest = request(app.getHttpServer());

    organizationRepository = app.get<Repository<OrganizationEntity>>(getRepositoryToken(OrganizationEntity));
    accountRepository = app.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
  });

  beforeEach(async () => {
    await AccountOperatarions.createDemoUserAccount(httpRequest);
    token = 'Bearer ' + (await AccountOperatarions.login(httpRequest));
    await httpRequest.post('/organizations').set('Accept', 'application/json').set('Authorization', token).send({
      name: 'Organization blue',
      key: 'organization-blue'
    });
  });

  afterEach(async () => {
    await cleanAll([organizationRepository, accountRepository]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('show a specific organization with details', async () => {
    const organization = await organizationRepository.findOne({ where: { key: 'organization-blue' } });
    const result = await httpRequest
      .get(`/organizations/${organization.hash}`)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(HttpStatus.OK);

    expect(result.body).toMatchObject({
      apiId: expect.any(String),
      apiSecret: expect.any(String),
      hash: expect.any(String),
      key: expect.any(String),
      name: expect.any(String)
    });
    expect(result.body.environments).toHaveLength(3);
    expect(result.body.environments[0]).toMatchObject({
      id: expect.any(Number),
      key: expect.any(String),
      name: expect.any(String),
      secret: {
        client: expect.any(String),
        mobile: expect.any(String),
        server: expect.any(String)
      }
    });
  });

  it('fails when does NOT have token', async () => {
    await httpRequest
      .get('/organizations/organization-blue')
      .set('Accept', 'application/json')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('fails when organization does NOT exist', async () => {
    await httpRequest
      .get('/organizations/dont-exist')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(HttpStatus.NOT_FOUND);
  });
});
