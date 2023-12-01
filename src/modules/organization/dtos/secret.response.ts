import { Expose } from 'class-transformer';
import { Secret } from 'modules/organization/domain/secret';

export class GetSecretResponse implements Partial<Secret> {
  @Expose()
  server: string;
  @Expose()
  client: string;
  @Expose()
  mobile: string;
}
