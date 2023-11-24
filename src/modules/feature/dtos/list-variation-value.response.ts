import { Expose } from 'class-transformer';
import { VariationValue } from 'modules/feature/domain/variation-value';

export class ListVariationValueResponse implements Partial<VariationValue> {
  @Expose()
  value?: unknown;
}
