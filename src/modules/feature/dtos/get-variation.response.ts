import { Expose } from 'class-transformer';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationType } from 'modules/feature/domain/variation.type';
import { VariationValueResponse } from 'modules/feature/dtos/variation-value.response';

export class GetVariationResponse implements Partial<VariationEntity> {
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  key: string;
  @Expose()
  type: VariationType;
  @Expose()
  values: VariationValueResponse[];
}
