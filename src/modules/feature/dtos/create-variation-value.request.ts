import { Expose } from 'class-transformer';

export class CreateVariationValueRequest {
  @Expose()
  value: string;
}
