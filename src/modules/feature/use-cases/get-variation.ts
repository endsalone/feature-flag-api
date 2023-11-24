import { Injectable } from '@nestjs/common';
import { UserOption } from 'common/user-type';
import { Variation } from 'modules/feature/domain/variation';
import { VariationValueService } from 'modules/feature/domain/variation-value.service';
import { VariationService } from 'modules/feature/domain/variation.service';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class GetVariation {
  constructor(
    private variationService: VariationService,
    private projectService: ProjectService,
    private variationValueService: VariationValueService
  ) {}

  async execute(projectSlug: string, variationKey: string, account: UserOption): Promise<Partial<Variation>> {
    const project = await this.projectService.findOneBySlugAndAccountAndOrganization(
      `'${projectSlug}'`,
      account.id,
      account.organization.id
    );
    if (!project) {
      throw new ProjectDoesNotExistException();
    }

    return this.variationService.findOne({ key: variationKey, project }, [
      'variation.key',
      'variation.description',
      'variation.type',
      'variation.description',
      'values.id',
      'values.value'
    ]);
  }
}
