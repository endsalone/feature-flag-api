import { Variation } from 'modules/feature/domain/variation';
import { Environment } from 'modules/project/domain/environment';

export enum FeatureType {
  RELEASE = 'release',
  EXPERIMENT = 'experiment'
}

export interface FeatureWithVariations {
  key: string;
  description: string;
  type: FeatureType;
  variations: Partial<Variation>[];
  environments?: Environment[];
}
