import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { OrganizationDoesNotExistException } from 'modules/organization/domain/exception/organization-does-not-exist';
import { OrganizationService } from 'modules/organization/domain/organization.service';
import { CreateOrganizationResponse } from 'modules/organization/dtos/create-organization.response';

@Injectable()
export class GetOrganization {
  constructor(private organizationService: OrganizationService) {}

  async execute(hash: string, options: UserOption): Promise<unknown> {
    const organization = await this.organizationService.findOneByHashAndAccount(hash, options.id);
    if (!organization) {
      throw new OrganizationDoesNotExistException();
    }

    return castWithObfuscation(CreateOrganizationResponse, organization);
  }
}
