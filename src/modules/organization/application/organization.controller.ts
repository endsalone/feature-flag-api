import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseInterceptors
} from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { CreateOrganizationRequest } from 'modules/organization/dtos/create-organization.request';
import { CreateOrganization } from 'modules/organization/use-cases/create-organization';
import { GetOrganization } from 'modules/organization/use-cases/get-organization';
import { ListOrganization } from 'modules/organization/use-cases/list-organization';
import { UpdateOrganization } from 'modules/organization/use-cases/update-organization';
import { OrganizationInterceptor } from './orgianization.interceptor';

@Controller('organizations')
@UseInterceptors(OrganizationInterceptor)
export class OrganizationController {
  constructor(
    readonly createOrganizationUseCase: CreateOrganization,
    readonly listOrganizationUseCase: ListOrganization,
    readonly getOrganizationUseCase: GetOrganization,
    readonly updateOrganizationUseCase: UpdateOrganization
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(
    @Request() options: RequestOptions,
    @Body() body: CreateOrganizationRequest
  ): Promise<unknown> {
    return this.createOrganizationUseCase.execute(body, options.user);
  }

  @Get('/')
  async listOrganizations(@Request() options: RequestOptions): Promise<unknown> {
    return this.listOrganizationUseCase.execute(options.user);
  }

  @Get('/:organizationHash')
  async getOrganization(@Param('organizationHash') hash: string, @Request() options: RequestOptions): Promise<unknown> {
    return this.getOrganizationUseCase.execute(hash, options.user);
  }

  @Put('/:organizationHash')
  async updateOrganization(
    @Param('organizationHash') hash: string,
    @Request() options: RequestOptions,
    @Body() body: CreateOrganizationRequest
  ): Promise<unknown> {
    return this.updateOrganizationUseCase.execute(hash, body, options.user);
  }
}
