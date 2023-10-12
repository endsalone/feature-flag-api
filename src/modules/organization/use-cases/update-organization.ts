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
    const hasOrganizationWithHash = await this.organizationService.findOneByHashAndAccount(hash, options.id);
    if (!hasOrganizationWithHash) {
      throw new OrganizationInternalServerErrorException();
    }
    const organizationEntityCasted = castWithoutObfuscation(OrganizationEntity, body);
    const organization = await this.organizationService.updateOrganization(organizationEntityCasted, options.id);

    return castWithObfuscation(CreateOrganizationResponse, organization);
  }
}
