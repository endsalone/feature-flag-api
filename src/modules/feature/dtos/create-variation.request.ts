import { VariationType } from 'modules/feature/domain/variation.type';

export class CreateVariationRequest {
  name: string;
  description: string;
  key: string;
  type: VariationType;
}
