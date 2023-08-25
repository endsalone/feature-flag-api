import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { FeatureAlreadyExistsException } from 'modules/feature/domain/exception/feature-exists';
import { FeatureEntity } from 'modules/feature/domain/feature.entity';
import { FeatureService } from 'modules/feature/domain/feature.service';
import { CreateFeatureRequest } from 'modules/feature/dtos/create-feature.request';
import { ProjectService } from 'modules/project/domain/project.service';
import { CreateFeatureResponse } from '../dtos/create-feature.response';

@Injectable()
export class CreateFeature {
  constructor(private projectService: ProjectService, private featureService: FeatureService) {}

  async execute(slug: string, feature: CreateFeatureRequest, account: UserOption): Promise<unknown> {
    const projectList = await this.projectService.findBySlugsAndAccount(`'${slug}'`, account.id);
    if (!projectList.length) {
      throw new Error('Project not found');
    }

    const hasFeature = await this.featureService.findOne({ key: feature.key });
    if (hasFeature) {
      throw new FeatureAlreadyExistsException();
    }

    const featureToCreate: Partial<FeatureEntity> = {
      ...feature,
      project: projectList[0]
    };
    const createdFeature = await this.featureService.createFeature(featureToCreate);

    return castWithObfuscation(CreateFeatureResponse, createdFeature);
  }
}
