import { Expose } from 'class-transformer';
import { Target } from 'modules/feature/domain/target';
import { ComparatorEnum } from 'modules/feature/domain/target.type';
import { VariationValue } from 'modules/feature/domain/variation-value';

export class UpdateTargetRequest implements Target {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  definitionProperty: string;
  @Expose()
  definitionComparator: ComparatorEnum;
  @Expose()
  definitionValue: string[];
  @Expose()
  variationValue: VariationValue;
}
