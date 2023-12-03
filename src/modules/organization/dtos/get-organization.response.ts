import { Expose } from 'class-transformer';
import { Organization } from 'modules/organization/domain/organization';
import { Environment } from 'modules/project/domain/environment';

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
