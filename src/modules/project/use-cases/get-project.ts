import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { ProjectService } from 'modules/project/domain/project.service';
import { ListProjectResponse } from 'modules/project/dtos/list-project.response';

@Injectable()
export class GetProject {
  constructor(private projectService: ProjectService) {}

  async execute(slug: string, options: UserOption): Promise<unknown> {
    const formatedSlug = `'${slug}'`;
    const projects = await this.projectService.findBySlugsAndAccount(formatedSlug, options.id);

    return castWithObfuscation(ListProjectResponse, projects);
  }
}
