import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectService } from 'modules/project/domain/project.service';
import { ListProjectResponse } from 'modules/project/dtos/list-project.response';

@Injectable()
export class GetProject {
  constructor(private projectService: ProjectService) {}

  async execute(slug: string, options: UserOption): Promise<ListProjectResponse> {
    const formatedSlug = `'${slug}'`;
    const projects = await this.projectService.findOneBySlugAndAccountAndOrganization(
      formatedSlug,
      options.id,
      options.organization.id
    );
    if (!projects) {
      throw new ProjectDoesNotExistException();
    }

    return castWithObfuscation(ListProjectResponse, projects);
  }
}
