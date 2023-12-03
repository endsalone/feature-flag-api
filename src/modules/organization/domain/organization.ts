import { Account } from 'modules/account/domain/account';

export interface Organization {
  id: number;
  name: string;
  key: string;
  permissions: Account[];
  hash: string;
  apiId: string;
  apiSecret: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
