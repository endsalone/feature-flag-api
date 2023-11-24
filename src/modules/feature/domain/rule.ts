import { Feature } from 'modules/feature/domain/feature';
import { Target } from 'modules/feature/domain/target';
import { Environment } from 'modules/organization/domain/environment';
import { MarkOptional } from 'ts-essentials';

export interface Rule {
  id: number;
  active: boolean;
  environment: Environment;
  targets: Partial<MarkOptional<Target, 'id'>>[];
  feature: Feature;
}
