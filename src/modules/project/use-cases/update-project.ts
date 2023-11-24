import { Injectable } from '@nestjs/common';
import { castWithObfuscation, castWithoutObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { ProjectEntity } from 'modules/project/domain/project.entity';
import { ProjectService } from 'modules/project/domain/project.service';
import { UpdateProjectRequest } from 'modules/project/dtos/update-project.request';
import { UpdateProjectResponse } from 'modules/project/dtos/update-project.response';

@Injectable()
export class UpdateProject {
  constructor(private projectService: ProjectService) {}

  async execute(slug: string, body: UpdateProjectRequest, user: UserOption): Promise<UpdateProjectResponse> {
    const bodyWithSlug: Partial<ProjectEntity> = { ...body, slug };
    const projectEntityCasted = castWithoutObfuscation(ProjectEntity, bodyWithSlug);

    const projectUpdated = await this.projectService.updateProject(projectEntityCasted, user.id, user.organization.id);

    return castWithObfuscation(UpdateProjectResponse, projectUpdated);
  }
}
