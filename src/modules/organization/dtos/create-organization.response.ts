import { Expose } from 'class-transformer';
import { Organization } from 'modules/organization/domain/organization';

export class CreateOrganizationResponse implements Partial<Organization> {
  @Expose()
  name: string;
  @Expose()
  key: string;
  @Expose()
  hash: string;
}
