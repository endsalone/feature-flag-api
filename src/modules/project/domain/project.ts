import { Organization } from 'modules/organization/domain/organization';

export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  organization: Partial<Organization>;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
