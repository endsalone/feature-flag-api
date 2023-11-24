import { Expose } from 'class-transformer';
import { EnvironmentResponse } from './environment.response';

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
}
