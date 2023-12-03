import { Expose } from 'class-transformer';
import { Secret } from 'modules/project/domain/secret';

export class SecretResponse implements Partial<Secret> {
  @Expose()
  server: string;
  @Expose()
  client: string;
  @Expose()
  mobile: string;
}
