import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { VariationType } from 'modules/feature/domain/variation.type';
import { VariationValueResponse } from 'modules/feature/dtos/variation-value.response';

export class UpdateVariationRequest {
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
  values: VariationValueResponse[];
}
