import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { EnvironmentService } from 'modules/organization/domain/environment.service';
import { EnvironmentResponse } from 'modules/organization/dtos/environment.response';

@Injectable()
export class GetEnvironment {
  constructor(private environmentService: EnvironmentService) {}

  async execute(options: UserOption): Promise<EnvironmentResponse[]> {
    const response = options.organization.environments.map((env) => castWithObfuscation(EnvironmentResponse, env));
    return response;
  }
}
