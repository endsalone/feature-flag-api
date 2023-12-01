import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { OrganizationEntity } from 'modules/organization/domain/organization.entity';
import * as request from 'supertest';
import { AccountOperatarions } from 'test/common/account/account-operations';
import { cleanAll, moduleInit } from 'test/test.utils';
import { Repository } from 'typeorm';

jest.setTimeout(10000);

describe('list-organization', () => {
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

  it('show a list with all the organizations', async () => {
    const result = await httpRequest
      .get('/organizations')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(HttpStatus.OK);

    expect(result.body).toHaveLength(1);
  });

  it('fails when does NOT have token', async () => {
    await httpRequest.get('/organizations').set('Accept', 'application/json').expect(HttpStatus.UNAUTHORIZED);
  });
});
