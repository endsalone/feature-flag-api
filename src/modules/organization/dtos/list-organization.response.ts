import { Expose } from 'class-transformer';
import { Organization } from 'modules/organization/domain/organization';

export class ListProjectResponse implements Partial<Organization> {
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  slug: string;
}
