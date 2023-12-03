import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { EnvironmentController } from 'modules/project/application/environment.controller';
import { ProjectsController } from 'modules/project/application/project.controller';
import { EnvironmentEntity } from 'modules/project/domain/environment.entity';
import { EnvironmentService } from 'modules/project/domain/environment.service';
import { ProjectEntity } from 'modules/project/domain/project.entity';
import { ProjectService } from 'modules/project/domain/project.service';
import { SecretEntity } from 'modules/project/domain/secret.entity';
import { CreateProject } from 'modules/project/use-cases/create-project';
import { DeleteProject } from 'modules/project/use-cases/delete-project';
import { GetEnvironment } from 'modules/project/use-cases/get-environment';
import { GetProject } from 'modules/project/use-cases/get-project';
import { ListProject } from 'modules/project/use-cases/list-project';
import { UpdateProject } from 'modules/project/use-cases/update-project';

const entities = [AccountEntity, ProjectEntity, EnvironmentEntity, SecretEntity];
const services = [
  ProjectService,
  CreateProject,
  UpdateProject,
  DeleteProject,
  ListProject,
  GetProject,
  GetEnvironment,
  EnvironmentService
];
const controllers = [ProjectsController, EnvironmentController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: services,
  controllers: controllers,
  exports: [ProjectService]
})
export class ProjectModule {}
