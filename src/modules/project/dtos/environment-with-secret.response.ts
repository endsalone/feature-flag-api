import { Expose } from 'class-transformer';
import { Environment } from 'modules/project/domain/environment';
import { Secret } from 'modules/project/domain/secret';

export class EnvironmentWithSecretResponse implements Partial<Environment> {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  key: string;
  @Expose()
  secret: Secret;
}
