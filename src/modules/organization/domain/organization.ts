import { Account } from 'modules/account/domain/account';
import { Environment } from 'modules/organization/domain/environment';

export interface Organization {
  id: number;
  name: string;
  key: string;
  environments: Environment[];
  permissions: Account[];
  hash: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
