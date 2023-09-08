import { Expose } from 'class-transformer';
import { VariationValue } from 'modules/feature/domain/variation-value';

export class CreateVariationValueResponse implements Partial<VariationValue> {
  @Expose()
  id: number;
  @Expose()
  value: string;
}
