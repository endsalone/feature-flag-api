import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { VariationType } from 'modules/feature/domain/variation.type';
import { CreateVariationValueResponse } from 'modules/feature/dtos/create-variation-value.response';

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
  values: CreateVariationValueResponse[];
}
