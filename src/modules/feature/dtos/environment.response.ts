import { Expose } from 'class-transformer';
import { Environment } from 'modules/project/domain/environment';

export class EnvironmentWithSecretResponse implements Partial<Environment> {
  @Expose()
  name?: string;
  @Expose()
  key?: string;
}
