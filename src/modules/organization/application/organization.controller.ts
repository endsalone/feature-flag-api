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
import { OrganizationInterceptor } from 'modules/organization/application/organization.interceptor';
import { CreateOrganizationRequest } from 'modules/organization/dtos/create-organization.request';
import { CreateOrganizationResponse } from 'modules/organization/dtos/create-organization.response';
import { GetOrganizationResponse } from 'modules/organization/dtos/get-organization.response';
import { CreateOrganization } from 'modules/organization/use-cases/create-organization';
import { GetOrganization } from 'modules/organization/use-cases/get-organization';
import { ListOrganization } from 'modules/organization/use-cases/list-organization';
import { UpdateOrganization } from 'modules/organization/use-cases/update-organization';

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
  ): Promise<CreateOrganizationResponse> {
    return this.createOrganizationUseCase.execute(body, options.user);
  }

  @Get('/')
  async listOrganizations(@Request() options: RequestOptions): Promise<CreateOrganizationResponse[]> {
    return this.listOrganizationUseCase.execute(options.user);
  }

  @Get('/:organizationHash')
  async getOrganization(
    @Param('organizationHash') hash: string,
    @Request() options: RequestOptions
  ): Promise<GetOrganizationResponse> {
    return this.getOrganizationUseCase.execute(hash, options.user);
  }

  @Put('/:organizationHash')
  async updateOrganization(
    @Param('organizationHash') hash: string,
    @Request() options: RequestOptions,
    @Body() body: CreateOrganizationRequest
  ): Promise<CreateOrganizationResponse> {
    return this.updateOrganizationUseCase.execute(hash, body, options.user);
  }
}
