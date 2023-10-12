import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { ListFeatureResponse } from 'modules/feature/dtos/list-feature.response';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class ListFeature {
  constructor(private projectService: ProjectService, private featureService: FeatureService) {}

  async execute(projectSlug: string, account: UserOption): Promise<unknown> {
    const project = await this.projectService.findOneBySlugAndAccount(`'${projectSlug}'`, account.id);
    if (!project) {
      throw new ProjectDoesNotExistException();
    }

    const listFeatureFromProject = await this.featureService.findByKeyAndProjectId(project.id);
    if (!listFeatureFromProject) {
      throw new Error('Feature not found');
    }

    return castWithObfuscation(ListFeatureResponse, listFeatureFromProject);
  }
}
