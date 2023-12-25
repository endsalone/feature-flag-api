import { IsEnum, IsString } from 'class-validator';
import { FeatureType } from 'modules/feature/domain/feature.type';
import { CreateVariationRequest } from 'modules/feature/dtos/create-variation.request';
import { MarkRequired } from 'ts-essentials';

export class UpdateFeatureRequest {
  @IsString()
  name: string;
  description: string;
  key: string;

  @IsEnum(FeatureType, { message: 'Invalid feature type' })
  type: FeatureType;

  variations: MarkRequired<Partial<CreateVariationRequest>, 'key'>[];
}
