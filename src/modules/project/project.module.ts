import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { ProjectsController } from 'modules/project/application/project.controller';
import { ProjectEntity } from 'modules/project/domain/project.entity';
import { ProjectService } from 'modules/project/domain/project.service';
import { CreateProject } from 'modules/project/use-cases/create-project';
import { DeleteProject } from 'modules/project/use-cases/delete-project';
import { GetProject } from 'modules/project/use-cases/get-project';
import { ListProject } from 'modules/project/use-cases/list-project';
import { ListProjectFeature } from 'modules/project/use-cases/list-project-feature';
import { UpdateProject } from 'modules/project/use-cases/update-project';

const entities = [AccountEntity, ProjectEntity];
const services = [
  ProjectService,
  CreateProject,
  UpdateProject,
  DeleteProject,
  ListProject,
  GetProject,
  ListProjectFeature
];
const controllers = [ProjectsController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: services,
  controllers: controllers,
  exports: [ProjectService]
})
export class ProjectModule {}
