import { ComparatorEnum, DefinitionEnum } from './target.type';
import { VariationValue } from './variation-value';

export interface Target {
  id: number;
  name: string;
  definitionProperty: DefinitionEnum | string;
  definitionComparator: ComparatorEnum | null;
  definitionValue: string[] | null;
  variationValue: VariationValue;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
