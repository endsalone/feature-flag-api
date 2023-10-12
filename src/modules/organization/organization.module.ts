import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from 'modules/organization/application/organization.controller';
import { EnvironmentEntity } from 'modules/organization/domain/environment.entity';
import { EnvironmentService } from 'modules/organization/domain/environment.service';
import { OrganizationEntity } from 'modules/organization/domain/organization.entity';
import { OrganizationService } from 'modules/organization/domain/organization.service';
import { CreateOrganization } from 'modules/organization/use-cases/create-organization';
import { GetOrganization } from 'modules/organization/use-cases/get-organization';
import { ListOrganization } from 'modules/organization/use-cases/list-organization';
import { UpdateOrganization } from 'modules/organization/use-cases/update-organization';

const useCases = [CreateOrganization, ListOrganization, GetOrganization, UpdateOrganization];
const entities = [OrganizationEntity, EnvironmentEntity];
const services = [OrganizationService, EnvironmentService];
const controllers = [OrganizationController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...useCases],
  controllers: controllers,
  exports: []
})
export class OrganizationModule {}
