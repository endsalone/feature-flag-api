import { Expose } from 'class-transformer';

export class OrganizationInterceptorDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  key: string;
  @Expose()
  hash: string;
}
