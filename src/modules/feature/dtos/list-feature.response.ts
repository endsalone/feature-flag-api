import { Expose } from 'class-transformer';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FeatureStatus, FeatureType } from 'modules/feature/domain/feature.type';

export class ListFeatureResponse implements Partial<FeatureEntity> {
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  key: string;
  @Expose()
  type: FeatureType;
  @Expose()
  status?: FeatureStatus;
}
