import { ACCOUNT_STATUS, ACCOUNT_TYPE } from 'modules/account/domain/account.type';

export interface Account {
  id: number;
  name: string;
  email: string;
  password: string;
  active: boolean;
  type: ACCOUNT_TYPE;
  status: ACCOUNT_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
