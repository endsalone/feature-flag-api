import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { OrganizationService } from 'modules/organization/domain/organization.service';
import { CreateOrganizationResponse } from 'modules/organization/dtos/create-organization.response';

@Injectable()
export class ListOrganization {
  constructor(private organizationService: OrganizationService) {}

  async execute(options: UserOption): Promise<CreateOrganizationResponse[]> {
    const organization = await this.organizationService.findManyByAccount(options.id);

    return organization.map((value) => castWithObfuscation(CreateOrganizationResponse, value));
  }
}
