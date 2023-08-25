import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturesController } from 'modules/feature/application/feature.controller';
import { VariationsController } from 'modules/feature/application/variation.controller';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationService } from 'modules/feature/domain/variation.service';
import { CreateFeature } from 'modules/feature/use-cases/create-feature';
import { CreateVariation } from 'modules/feature/use-cases/create-variation';
import { GetFeature } from 'modules/feature/use-cases/get-feature';
import { ListFeature } from 'modules/feature/use-cases/list-feature';

const services = [FeatureService, VariationService];
const featureUseCases = [CreateFeature, ListFeature, GetFeature];
const variationUseCases = [CreateVariation];
const controllers = [FeaturesController, VariationsController];
const entities = [FeatureEntity, VariationEntity];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...featureUseCases, ...variationUseCases],
  controllers: controllers
})
export class FeatureModule {}
