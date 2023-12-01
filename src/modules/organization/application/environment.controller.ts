import { Controller, Get, HttpCode, HttpStatus, Request, UseInterceptors } from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { OrganizationInterceptor } from 'modules/organization/application/organization.interceptor';
import { EnvironmentResponse } from 'modules/organization/dtos/environment.response';
import { GetEnvironment } from 'modules/organization/use-cases/get-environment';

@Controller('/organizations/:organizationHash/environments')
@UseInterceptors(OrganizationInterceptor)
export class EnvironmentController {
  constructor(readonly getEnvironmentUseCase: GetEnvironment) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getEnvironment(@Request() options: RequestOptions): Promise<EnvironmentResponse[]> {
    return this.getEnvironmentUseCase.execute(options.user);
  }
}
