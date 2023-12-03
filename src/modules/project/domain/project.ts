import { Account } from 'modules/account/domain/account';
import { Organization } from 'modules/organization/domain/organization';
import { Environment } from 'modules/project/domain/environment';
import { Permission } from 'modules/project/domain/permission';

export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  permissions: Account[] | Permission[];
  organization: Organization;
  environments: Environment[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
