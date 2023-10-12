import { Expose } from 'class-transformer';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FeatureType } from 'modules/feature/domain/feature.type';

export class ListFeatureResponse implements Partial<FeatureEntity> {
  @Expose()
  description: string;
  @Expose()
  key: string;
  @Expose()
  type: FeatureType;
}
