import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { AccountService } from 'modules/account/domain/account.service';
import * as request from 'supertest';
import { AccountOperatarions } from 'test/common/account/account-operations';
import { Repository } from 'typeorm';
import { cleanAll, moduleInit } from '../../test.utils';

jest.setTimeout(10000);

describe('create account', () => {
  let app: INestApplication;
  let httpRequest: request.SuperTest<request.Test>;
  let accountService: AccountService;
  let accountRepository: Repository<AccountEntity>;

  beforeAll(async () => {
    app = await moduleInit();

    httpRequest = request(app.getHttpServer());
    accountService = app.get(AccountService);
    accountRepository = app.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
  });

  afterEach(async () => {
    await cleanAll([accountRepository]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('succeed with user creation', async () => {
    await httpRequest
      .post('/accounts')
      .set('Accept', 'application/json')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'blabla',
        type: 'USER'
      })
      .expect(HttpStatus.CREATED);

    const existAccount = await accountService.findByEmail('test@test.com');
    expect(existAccount).toMatchObject({
      id: 1,
      name: 'Test',
      email: 'test@test.com',
      active: true,
      status: 'ACTIVE',
      type: 'USER'
    });
  });

  it('succeed with professional creation', async () => {
    await httpRequest
      .post('/accounts')
      .set('Accept', 'application/json')
      .send({
        name: 'Test Professional',
        email: 'test_professional@test.com',
        password: 'blabla',
        type: 'PROFESSIONAL'
      })
      .expect(HttpStatus.CREATED);

    const existAccount = await accountService.findByEmail('test_professional@test.com');
    expect(existAccount).toMatchObject({
      id: 1,
      name: 'Test Professional',
      email: 'test_professional@test.com',
      active: false,
      status: 'PENDING',
      type: 'PROFESSIONAL'
    });
  });

  it('throws an error when some account already exists with same email', async () => {
    await AccountOperatarions.createDemoUserAccount(httpRequest);

    await httpRequest
      .post('/accounts')
      .send({
        name: 'New Name',
        email: 'test1@test.com',
        password: 'blabla',
        street: 'Bakery Street',
        number: '100',
        zipcode: '001',
        complement: '',
        neighborhood: 'Bread Village',
        city: 'Flour City',
        province: 'Bread Province',
        country: 'BR',
        type: 'USER'
      })
      .expect(400)
      .expect({
        statusCode: 400,
        code: 'ACCOUNT_ALREADY_EXISTS',
        detail: 'Account already exists',
        source: {
          pointer: 'email'
        }
      });

    const existAccount = await accountService.find({ name: 'New Name' });
    expect(existAccount).toHaveLength(0);
  });

  describe('validation', () => {
    it('throws an error when all fields are not provided', async () => {
      const result = await httpRequest
        .post('/accounts')
        .send({
          email: ''
        })
        .expect(422);

      const existAccount = await accountService.find({ email: 'test1@test.com' });
      expect(existAccount).toHaveLength(0);
    });
  });
});
