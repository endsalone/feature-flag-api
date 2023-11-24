import { Expose } from 'class-transformer';
import { Environment } from 'modules/organization/domain/environment';

export class EnvironmentResponse implements Partial<Environment> {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  key: string;
}
