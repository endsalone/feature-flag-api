import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { ProjectService } from 'modules/project/domain/project.service';
import { ListProjectResponse } from 'modules/project/dtos/list-project.response';

@Injectable()
export class ListProject {
  constructor(private projectService: ProjectService) {}

  async execute(options: UserOption): Promise<unknown> {
    const projects = await this.projectService.findByAccountId(options.id);

    return castWithObfuscation(ListProjectResponse, projects);
  }
}
