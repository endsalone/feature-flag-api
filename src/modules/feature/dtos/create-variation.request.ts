import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { VariationType } from 'modules/feature/domain/variation.type';

export class CreateVariationRequest {
  @Expose()
  description: string;
  @Expose()
  key: string;
  @Expose()
  @IsEnum(VariationType)
  type: VariationType;
}
