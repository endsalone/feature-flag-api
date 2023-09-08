import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturesController } from 'modules/feature/application/feature.controller';
import { VariationsController } from 'modules/feature/application/variation.controller';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { VariationValueEntity } from 'modules/feature/domain/variation-value.entity';
import { VariationValueService } from 'modules/feature/domain/variation-value.service';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationService } from 'modules/feature/domain/variation.service';
import { CreateFeature } from 'modules/feature/use-cases/create-feature';
import { CreateVariation } from 'modules/feature/use-cases/create-variation';
import { GetFeature } from 'modules/feature/use-cases/get-feature';
import { GetVariation } from 'modules/feature/use-cases/get-variation';
import { ListFeature } from 'modules/feature/use-cases/list-feature';

const services = [FeatureService, VariationService, VariationValueService];
const featureUseCases = [CreateFeature, ListFeature, GetFeature];
const variationUseCases = [CreateVariation, GetVariation];
const controllers = [FeaturesController, VariationsController];
const entities = [FeatureEntity, VariationEntity, VariationValueEntity];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...featureUseCases, ...variationUseCases],
  controllers: controllers
})
export class FeatureModule {}
