import { Injectable } from '@nestjs/common';
import { castWithObfuscation, castWithoutObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { OrganizationInternalServerErrorException } from 'modules/organization/domain/exception/organization-internal-server-error';
import { OrganizationEntity } from 'modules/organization/domain/organization.entity';
import { OrganizationService } from 'modules/organization/domain/organization.service';
import { CreateOrganizationRequest } from 'modules/organization/dtos/create-organization.request';
import { CreateOrganizationResponse } from 'modules/organization/dtos/create-organization.response';

@Injectable()
export class UpdateOrganization {
  constructor(private organizationService: OrganizationService) {}

  async execute(
    hash: string,
    body: CreateOrganizationRequest,
    options?: UserOption
  ): Promise<CreateOrganizationResponse> {
    const organizationWithHash = await this.organizationService.findOneByHashAndAccount(
      options.organization.hash,
      options.id
    );
    if (!organizationWithHash) {
      throw new OrganizationInternalServerErrorException();
    }

    const organizationData = {
      ...organizationWithHash,
      ...body
    };
    const organizationEntityCasted = castWithoutObfuscation(OrganizationEntity, organizationData);
    const organization = await this.organizationService.updateOrganization(organizationEntityCasted);

    return castWithObfuscation(CreateOrganizationResponse, organization);
  }
}
