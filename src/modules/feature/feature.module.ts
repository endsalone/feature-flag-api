import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturesController } from 'modules/feature/application/feature.controller';
import { RuleController } from 'modules/feature/application/rule.controller';
import { VariationsController } from 'modules/feature/application/variation.controller';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { RuleEntity } from 'modules/feature/domain/rule.entity';
import { RuleService } from 'modules/feature/domain/rule.service';
import { TargetEntity } from 'modules/feature/domain/target.entity';
import { TargetService } from 'modules/feature/domain/target.service';
import { VariationValueEntity } from 'modules/feature/domain/variation-value.entity';
import { VariationValueService } from 'modules/feature/domain/variation-value.service';
import { VariationEntity } from 'modules/feature/domain/variation.entity';
import { VariationService } from 'modules/feature/domain/variation.service';
import { CreateFeature } from 'modules/feature/use-cases/create-feature';
import { CreateVariation } from 'modules/feature/use-cases/create-variation';
import { GetFeature } from 'modules/feature/use-cases/get-feature';
import { GetRule } from 'modules/feature/use-cases/get-rule';
import { GetVariation } from 'modules/feature/use-cases/get-variation';
import { ListFeature } from 'modules/feature/use-cases/list-feature';
import { ListRule } from 'modules/feature/use-cases/list-rule';
import { ListVariation } from 'modules/feature/use-cases/list-variation';
import { UpdateFeature } from 'modules/feature/use-cases/update-feature';
import { UpdateRule } from 'modules/feature/use-cases/update-rule';
import { UpdateVariation } from 'modules/feature/use-cases/update-variation';

const services = [FeatureService, VariationService, VariationValueService, TargetService, RuleService, UpdateRule];
const featureUseCases = [CreateFeature, ListFeature, GetFeature, ListRule, GetRule, UpdateFeature];
const variationUseCases = [CreateVariation, GetVariation, UpdateVariation, ListVariation];
const controllers = [FeaturesController, VariationsController, RuleController];
const entities = [FeatureEntity, VariationEntity, VariationValueEntity, TargetEntity, RuleEntity];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...featureUseCases, ...variationUseCases],
  controllers: controllers
})
export class FeatureModule {}
