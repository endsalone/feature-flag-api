import { Injectable } from '@nestjs/common';
import { castWithObfuscation, castWithoutObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { ProjectEntity } from 'modules/project/domain/project.entity';
import { ProjectService } from 'modules/project/domain/project.service';
import { CreateProjectRequest } from 'modules/project/dtos/create-project.request';
import { CreateProjectResponse } from 'modules/project/dtos/create-project.response';

@Injectable()
export class CreateProject {
  constructor(private projectService: ProjectService) {}

  async execute(body: CreateProjectRequest, options?: UserOption): Promise<CreateProjectResponse> {
    const projectEntityToBeCasted = {
      ...body,
      organization: options.organization
    };
    const projectEntityCasted = castWithoutObfuscation(ProjectEntity, projectEntityToBeCasted);
    const project = await this.projectService.createProject(projectEntityCasted, options.id);

    return castWithObfuscation(CreateProjectResponse, project);
  }
}
