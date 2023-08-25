import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { AccountService } from 'modules/account/domain/account.service';
import * as request from 'supertest';
import { AccountOperatarions } from 'test/common/account/account-operations';
import { Repository } from 'typeorm';
import { cleanAll, moduleInit } from '../../test.utils';

jest.setTimeout(10000);

describe('update account', () => {
  let app: INestApplication;
  let httpRequest: request.SuperTest<request.Test>;
  let accountService: AccountService;
  let accountRepository: Repository<AccountEntity>;
  let token: string;

  beforeAll(async () => {
    app = await moduleInit();

    httpRequest = request(app.getHttpServer());
    accountService = app.get(AccountService);
    accountRepository = app.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
  });

  beforeEach(async () => {
    await AccountOperatarions.createDemoUserAccount(httpRequest);
    token = await AccountOperatarions.login(httpRequest);
  });

  afterEach(async () => {
    await cleanAll([accountRepository]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('succeed with user update', async () => {
    await httpRequest
      .put('/accounts/me')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Updated',
        email: 'test_new@test.com'
      })
      .expect(HttpStatus.NO_CONTENT);

    const account = await accountService.findByEmail('test_new@test.com');
    expect(account).toMatchObject({
      id: 1,
      name: 'Test Updated',
      email: 'test_new@test.com',
      active: true,
      status: 'ACTIVE',
      type: 'USER'
    });
  });

  it('throws an error when the user does NOT exist', async () => {
    await cleanAll([accountRepository]);

    const response = await httpRequest
      .put('/accounts/me')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Updated',
        email: 'test_new@test.com',
        street: 'Bakery Street',
        number: '100',
        zipcode: '002',
        complement: '',
        neighborhood: 'Bread Village',
        city: 'Flour City',
        province: 'Bread Province Updated',
        country: 'USA'
      })
      .expect(HttpStatus.NOT_FOUND);

    const account = await accountService.findByEmail('test_new@test.com');
    expect(account).toBeNull();
  });
});
