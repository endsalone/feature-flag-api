import { Variation } from 'modules/feature/domain/variation';

export enum FeatureType {
  RELEASE = 'release',
  EXPERIMENT = 'experiment'
}

export interface FeatureWithVariations {
  key: string;
  description: string;
  type: FeatureType;
  variations: Partial<Variation>[];
}
