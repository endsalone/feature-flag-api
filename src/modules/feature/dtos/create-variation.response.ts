import { Expose } from 'class-transformer';
import { VariationValue } from 'modules/feature/domain/variation-value';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationType } from 'modules/feature/domain/variation.type';

export class CreateVariationResponse implements Partial<VariationEntity> {
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  key: string;
  @Expose()
  type: VariationType;
  @Expose()
  values: VariationValue[];
}
