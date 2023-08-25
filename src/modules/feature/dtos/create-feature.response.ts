import { Expose } from 'class-transformer';
import { FeatureType } from 'modules/feature/domain/feature.type';

export class CreateFeatureResponse {
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  key: string;
  @Expose()
  type: FeatureType;
}
