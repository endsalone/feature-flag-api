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

  async execute(projectSlug: string, account: UserOption): Promise<ListFeatureResponse> {
    const project = await this.projectService.findOneBySlugAndAccountAndOrganization(
      `'${projectSlug}'`,
      account.id,
      account.organization.id
    );
    if (!project) {
      throw new ProjectDoesNotExistException();
    }

    const listFeatureFromProject = await this.featureService.findByProjectId(project.id);
    if (!listFeatureFromProject) {
      throw new Error('Feature not found');
    }

    return castWithObfuscation(ListFeatureResponse, listFeatureFromProject);
  }
}
