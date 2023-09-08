import { VariationValue } from 'modules/feature/domain/variation-value';
import { VariationType } from 'modules/feature/domain/variation.type';

export interface Variation {
  id: number;
  description: string;
  key: string;
  type: VariationType;
  values: Partial<VariationValue>[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
