import { Expose } from 'class-transformer';
import { Environment } from 'modules/organization/domain/environment';
import { Organization } from 'modules/organization/domain/organization';

export class GetOrganizationResponse implements Partial<Organization> {
  @Expose()
  name: string;
  @Expose()
  key: string;
  @Expose()
  hash: string;
  @Expose()
  apiId: string;
  @Expose()
  apiSecret: string;
  @Expose()
  environments: Environment[];
}
