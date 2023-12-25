import { Injectable } from '@nestjs/common';
import { FeatureDoesNotExistException } from 'modules/feature/domain/exception/feature-does-not-exist';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { RuleService } from 'modules/feature/domain/rule.service';
import { VariationService } from 'modules/feature/domain/variation.service';
import { UpdateFeatureRequest } from 'modules/feature/dtos/update-feature.request';
import { VariationDoesNotExistException } from '../domain/exception/variation-does-not-exist';
import { VariationEntity } from '../domain/variation.entity';

@Injectable()
export class UpdateFeature {
  constructor(
    private featureService: FeatureService,
    private variationService: VariationService,
    private ruleService: RuleService
  ) {}

  async execute(feature: UpdateFeatureRequest, featureKey: string): Promise<void> {
    if (feature.key !== featureKey) {
      throw new FeatureDoesNotExistException();
    }

    const existentFeature = await this.featureService.findOne({ key: feature.key }, null, ['variations']);
    if (!existentFeature) {
      throw new FeatureDoesNotExistException();
    }

    const variationsId: VariationEntity[] = [];
    for (const variation of feature.variations) {
      const existentVariation = await this.variationService.findOne({ key: variation.key });
      if (!existentVariation) {
        throw new VariationDoesNotExistException();
      }

      variationsId.push({ id: existentVariation.id } as VariationEntity);
    }

    // const variations = feature.variations.map(async (variation) => {
    //   const existentVariation = await this.variationService.findOne({ key: variation.key });
    //   if (!existentVariation) {
    //     throw new VariationDoesNotExistException();
    //   }

    //   return {
    //     id: existentVariation.id
    //   } as VariationEntity;
    // });

    // await Promise.all(variations);

    existentFeature.variations = variationsId;
    await this.featureService.updateFeature(existentFeature);

    return;
  }
}
