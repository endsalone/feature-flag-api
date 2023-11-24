import { Expose } from 'class-transformer';
import { Environment } from 'modules/organization/domain/environment';

export class EnvironmentResponse implements Partial<Environment> {
  @Expose()
  name?: string;
  @Expose()
  key?: string;
}
