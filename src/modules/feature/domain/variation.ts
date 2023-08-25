import { VariationType } from 'modules/feature/domain/variation.type';

export interface Variation {
  id: number;
  key: string;
  type: VariationType;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
