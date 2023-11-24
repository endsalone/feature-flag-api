import { AccountEntity } from 'modules/account/domain/account.entity';
import { ACCOUNT_STATUS, ACCOUNT_TYPE } from 'modules/account/domain/account.type';
import { AccountCreateRequest } from 'modules/account/dtos/account-create.request';

export const accountData: AccountEntity = {
  id: 1,
  name: 'Test',
  email: 'test1@test.com',
  password: 'blabla',
  type: ACCOUNT_TYPE.USER,
  active: true,
  status: ACCOUNT_STATUS.ACTIVE
};

export const userAccountDemoData: AccountCreateRequest = {
  name: 'Test',
  email: 'test1@test.com',
  password: 'blabla',
  type: ACCOUNT_TYPE.USER
};
