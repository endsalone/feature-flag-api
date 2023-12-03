import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { ProjectService } from 'modules/project/domain/project.service';
import { EnvironmentWithSecretResponse } from 'modules/project/dtos/environment-with-secret.response';
import { SecretResponse } from 'modules/project/dtos/secret.response';

@Injectable()
export class GetEnvironment {
  constructor(readonly projectService: ProjectService) {}

  async execute(account: UserOption): Promise<EnvironmentWithSecretResponse[]> {
    const environmentsWithSecrets = account.project.environments.map((env) => ({
      ...env,
      secret: castWithObfuscation(SecretResponse, env.secret)
    }));

    return environmentsWithSecrets.map((env) => castWithObfuscation(EnvironmentWithSecretResponse, env));
  }
}
