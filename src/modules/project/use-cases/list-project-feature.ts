import { Injectable } from '@nestjs/common';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class ListProjectFeature {
  constructor(private projectService: ProjectService) {}

  async execute(slug: string): Promise<unknown> {
    // const projects = await this.projectService.findBySlugAndAccount(slug);
    // return castWithObfuscation(ListProjectResponse, projects);
    return null;
  }
}
