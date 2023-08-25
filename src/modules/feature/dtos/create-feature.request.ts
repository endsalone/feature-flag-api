import { FeatureType } from 'modules/feature/domain/feature.type';

export class CreateFeatureRequest {
  name: string;
  description: string;
  key: string;
  type: FeatureType;
}
