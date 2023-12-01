import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentController } from 'modules/organization/application/environment.controller';
import { OrganizationController } from 'modules/organization/application/organization.controller';
import { EnvironmentEntity } from 'modules/organization/domain/environment.entity';
import { EnvironmentService } from 'modules/organization/domain/environment.service';
import { OrganizationEntity } from 'modules/organization/domain/organization.entity';
import { OrganizationService } from 'modules/organization/domain/organization.service';
import { SecretEntity } from 'modules/organization/domain/secret.entity';
import { CreateOrganization } from 'modules/organization/use-cases/create-organization';
import { GetEnvironment } from 'modules/organization/use-cases/get-environment';
import { GetOrganization } from 'modules/organization/use-cases/get-organization';
import { ListOrganization } from 'modules/organization/use-cases/list-organization';
import { UpdateOrganization } from 'modules/organization/use-cases/update-organization';

const useCases = [CreateOrganization, ListOrganization, GetOrganization, UpdateOrganization, GetEnvironment];
const entities = [OrganizationEntity, EnvironmentEntity, SecretEntity];
const services = [OrganizationService, EnvironmentService];
const controllers = [OrganizationController, EnvironmentController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...useCases],
  controllers: controllers,
  exports: [OrganizationService]
})
export class OrganizationModule {}
