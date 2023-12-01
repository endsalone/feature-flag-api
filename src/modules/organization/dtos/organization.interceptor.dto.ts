import { Expose } from 'class-transformer';
import { Secret } from 'modules/organization/domain/secret';
import { EnvironmentResponse } from 'modules/organization/dtos/environment.response';

export class OrganizationInterceptorDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  key: string;
  @Expose()
  hash: string;
  @Expose()
  environments: EnvironmentResponse[];
  @Expose()
  secret: Partial<Secret>;
}
