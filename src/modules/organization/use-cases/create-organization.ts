import { Injectable } from '@nestjs/common';
import { castWithObfuscation, castWithoutObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { OrganizationEntity } from 'modules/organization/domain/organization.entity';
import { OrganizationService } from 'modules/organization/domain/organization.service';
import { CreateOrganizationRequest } from 'modules/organization/dtos/create-organization.request';
import { CreateOrganizationResponse } from '../dtos/create-organization.response';

@Injectable()
export class CreateOrganization {
  constructor(private organizationService: OrganizationService) {}

  async execute(body: CreateOrganizationRequest, options?: UserOption): Promise<unknown> {
    const organizationEntityCasted = castWithoutObfuscation(OrganizationEntity, body);
    const organization = await this.organizationService.createOrganization(organizationEntityCasted, options.id);

    return castWithObfuscation(CreateOrganizationResponse, organization);
  }
}
