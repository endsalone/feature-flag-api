import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { VariationValue } from 'modules/feature/domain/variation-value';
import { VariationType } from 'modules/feature/domain/variation.type';

export class CreateVariationRequest {
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  key: string;
  @Expose()
  @IsEnum(VariationType)
  type: VariationType;
  @Expose()
  variationValues: VariationValue[];
}
