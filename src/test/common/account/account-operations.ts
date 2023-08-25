import { AccountEntity } from 'modules/account/domain/account.entity';
import { AccountCreateRequest } from 'modules/account/dtos/account-create.request';
import { SuperTest, Test } from 'supertest';
import {
  adminAccountDemoData,
  professionalAccountDemoData,
  userAccountDemoData
} from 'test/common/account/account-data';

export class AccountOperatarions {

  static async createDemoUserAccount(
    httpRequest: SuperTest<Test>,
    newAccountDemoData?: AccountCreateRequest
  ): Promise<AccountEntity> {
    const result = await httpRequest
      .post('/accounts')
      .send(userAccountDemoData);

    return result.body as AccountEntity;
  }

  static async createDemoProfessionalAccount(
    httpRequest: SuperTest<Test>,
    newAccountDemoData?: AccountCreateRequest
  ): Promise<AccountEntity> {
    const result = await httpRequest
      .post('/accounts')
      .send(professionalAccountDemoData);

    return result.body as AccountEntity;
  }

  static async createDemoAdminAccount(
    httpRequest: SuperTest<Test>
  ): Promise<AccountEntity> {
    const result = await httpRequest
      .post('/accounts')
      .send(adminAccountDemoData);

    return result.body as AccountEntity;
  }

  static async login(
    httpRequest: SuperTest<Test>,
    email?: string,
    password?: string
  ): Promise<string> {
    const result = await httpRequest
      .post('/auth/login')
      .send({
        username: email ?? userAccountDemoData.email,
        password: password ?? userAccountDemoData.password
      });

    return result.body.token;
  }
}