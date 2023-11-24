import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { ACCOUNT_STATUS, ACCOUNT_TYPE } from 'modules/account/domain/account.type';
import * as request from 'supertest';
import { userAccountDemoData } from 'test/common/account/account-data';
import { AccountOperatarions } from 'test/common/account/account-operations';
import { cleanAll, moduleInit } from 'test/test.utils';
import { Repository } from 'typeorm';

jest.setTimeout(10000);

describe('get profile info', () => {
  let app: INestApplication;
  let httpRequest: request.SuperTest<request.Test>;
  let accountRepository: Repository<AccountEntity>;

  beforeAll(async () => {
    app = await moduleInit();

    httpRequest = request(app.getHttpServer());

    accountRepository = app.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
  });

  beforeEach(async () => {
    await AccountOperatarions.createDemoUserAccount(httpRequest);
  });

  afterEach(async () => {
    await cleanAll([accountRepository]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('throws 401 error when token is invalid', async () => {
    await httpRequest.get('/accounts/me').set('Authorization', 'Bearer invalid-token').expect(401);
  });

  it('shows the profile info when the request has the jwt token', async () => {
    const token = await AccountOperatarions.login(httpRequest, userAccountDemoData.email, userAccountDemoData.password);

    const response = await httpRequest.get('/accounts/me').set('Authorization', `Bearer ${token}`).expect(200);

    expect(response.body).toMatchObject({
      id: 1,
      email: 'test1@test.com',
      status: ACCOUNT_STATUS.ACTIVE,
      type: ACCOUNT_TYPE.USER
    });
  });
});
