import { Expose } from 'class-transformer';
import { Target } from 'modules/feature/domain/target';
import { ComparatorEnum, DefinitionEnum } from 'modules/feature/domain/target.type';
import { VariationValue } from 'modules/feature/domain/variation-value';

export class ListTargetResponse implements Partial<Target> {
  @Expose()
  id: number;
  @Expose()
  name?: string;
  @Expose()
  definitionProperty?: DefinitionEnum;
  @Expose()
  definitionComparator?: ComparatorEnum;
  @Expose()
  definitionValue?: string[];
  @Expose()
  variationValue: VariationValue;
}
