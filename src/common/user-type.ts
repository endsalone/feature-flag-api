import { Request } from 'express';
import { ACCOUNT_STATUS, ACCOUNT_TYPE } from 'modules/account/domain/account.type';

export type UserOption = {
  id: number;
  email: string;
  type: ACCOUNT_TYPE;
  status: ACCOUNT_STATUS;
  active: boolean;
};

export type RequestOptions = {
  user: UserOption;
} & Request;
