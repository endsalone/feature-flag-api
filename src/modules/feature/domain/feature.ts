import { FeatureType } from 'modules/feature/domain/feature.type';
import { Variation } from 'modules/feature/domain/variation';
import { Project } from 'modules/project/domain/project';

export interface Feature {
  id: number;
  name: string;
  description: string;
  key: string;
  type: FeatureType;
  project: Project;
  variations: Variation[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
