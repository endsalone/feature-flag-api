import { Controller, Get, HttpCode, HttpStatus, Param, Request, UseInterceptors } from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { EnvironmentInterceptor } from 'modules/organization/application/environment.interceptor';
import { OrganizationInterceptor } from 'modules/organization/application/organization.interceptor';
import { EnvironmentWithSecretResponse } from 'modules/project/dtos/environment-with-secret.response';
import { GetEnvironment } from 'modules/project/use-cases/get-environment';

@Controller('/organizations/:organizationHash/projects')
@UseInterceptors(OrganizationInterceptor, EnvironmentInterceptor)
export class EnvironmentController {
  constructor(readonly getEnvironmentUseCase: GetEnvironment) {}

  @Get('/:slug/environments')
  @HttpCode(HttpStatus.OK)
  async getEnvironment(
    @Param('slug') slug: string,
    @Request() options: RequestOptions
  ): Promise<EnvironmentWithSecretResponse[]> {
    return this.getEnvironmentUseCase.execute(options.user);
  }
}
