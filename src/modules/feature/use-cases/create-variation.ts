import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { VariationService } from 'modules/feature/domain/variation.service';
import { CreateVariationRequest } from 'modules/feature/dtos/create-variation.request';
import { CreateFeatureResponse } from '../dtos/create-feature.response';

@Injectable()
export class CreateVariation {
  constructor(private variationService: VariationService, private featureService: FeatureService) {}

  async execute(slug: string, feature: CreateVariationRequest, account: UserOption): Promise<unknown> {
    return castWithObfuscation(CreateFeatureResponse, null);
  }
}
