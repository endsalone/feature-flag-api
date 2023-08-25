import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import * as request from 'supertest';
import { professionalAccountDemoData, userAccountDemoData } from 'test/common/account/account-data';
import { AccountOperatarions } from 'test/common/account/account-operations';
import { cleanAll, moduleInit } from 'test/test.utils';
import { Repository } from 'typeorm';

jest.setTimeout(10000);

describe('login', () => {
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
    await AccountOperatarions.createDemoProfessionalAccount(httpRequest);
  });

  afterEach(async () => {
    await cleanAll([accountRepository]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates JWT token to user account', async () => {
    const result = await httpRequest
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: userAccountDemoData.email,
        password: userAccountDemoData.password
      })
      .expect(200);

    expect(result.body).toHaveProperty('token');
  });

  it('does NOT generate the token when the professional account is NOT activated', async () => {
    await cleanAll([accountRepository]);
    await AccountOperatarions.createDemoProfessionalAccount(httpRequest);

    const result = await httpRequest
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: professionalAccountDemoData.email,
        password: professionalAccountDemoData.password
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        statusCode: 400,
        code: 'PROFESSIONAL_ACCOUNT_INCOMPLETE',
        detail: 'Professional account is incomplete',
        source: {}
      });
  });

  it.each([{ email: 'wrong@email.com' }, { password: 'wrong' }])(
    'fails with invalid credentials (data=%s)',
    async (loginData) => {
      const result = await httpRequest
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'test1@test.com',
          password: 'blabla',
          ...loginData
        })
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    }
  );
});
