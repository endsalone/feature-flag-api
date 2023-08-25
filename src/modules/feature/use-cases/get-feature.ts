import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { FeatureDoesNotExistException } from 'modules/feature/domain/exception/feature-does-not-exists';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { ListFeatureResponse } from 'modules/feature/dtos/list-feature.response';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class GetFeature {
  constructor(private projectService: ProjectService, private featureService: FeatureService) {}

  async execute(projectSlug: string, featureKey: string, account: UserOption): Promise<unknown> {
    const projectList = await this.projectService.findOneBySlugAndAccount(`'${projectSlug}'`, account.id);
    if (!projectList) {
      throw new Error('Project not found');
    }

    const featureFromProject = await this.featureService.findOneByKeyAndProjectId(featureKey, projectList.id);
    if (!featureFromProject) {
      throw new FeatureDoesNotExistException();
    }

    return castWithObfuscation(ListFeatureResponse, featureFromProject);
  }
}
