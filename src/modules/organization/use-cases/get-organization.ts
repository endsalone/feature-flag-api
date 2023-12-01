import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { OrganizationDoesNotExistException } from 'modules/organization/domain/exception/organization-does-not-exist';
import { Organization } from 'modules/organization/domain/organization';
import { OrganizationService } from 'modules/organization/domain/organization.service';
import { EnvironmentResponse } from 'modules/organization/dtos/environment.response';
import { GetOrganizationResponse } from 'modules/organization/dtos/get-organization.response';
import { GetSecretResponse } from 'modules/organization/dtos/secret.response';

@Injectable()
export class GetOrganization {
  constructor(private organizationService: OrganizationService) {}

  async execute(hash: string, options: UserOption): Promise<GetOrganizationResponse> {
    const organization: Organization = await this.organizationService.findOneByHashAndAccount(hash, options.id);
    if (!organization) {
      throw new OrganizationDoesNotExistException();
    }

    const castedOrganizationWithEnv = organization.environments.map((env) => ({
      ...castWithObfuscation(EnvironmentResponse, env),
      secret: castWithObfuscation(GetSecretResponse, env.secret)
    }));

    return castWithObfuscation(GetOrganizationResponse, {
      ...organization,
      environments: castedOrganizationWithEnv
    });
  }
}
