import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request, UseInterceptors } from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { FeatureWithVariations } from 'modules/feature/domain/feature.type';
import { CreateFeatureRequest } from 'modules/feature/dtos/create-feature.request';
import { ListFeatureResponse } from 'modules/feature/dtos/list-feature.response';
import { CreateFeature } from 'modules/feature/use-cases/create-feature';
import { GetFeature } from 'modules/feature/use-cases/get-feature';
import { ListFeature } from 'modules/feature/use-cases/list-feature';
import { EnvironmentInterceptor } from 'modules/organization/application/environment.interceptor';
import { OrganizationInterceptor } from 'modules/organization/application/organization.interceptor';

@Controller('/organizations/:organizationHash/projects/:slug')
@UseInterceptors(OrganizationInterceptor, EnvironmentInterceptor)
export class FeaturesController {
  constructor(
    private readonly createFeature: CreateFeature,
    private readonly listFeature: ListFeature,
    private readonly getFeature: GetFeature
  ) {}

  @Post('features')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('slug') slug: string,
    @Body() feature: CreateFeatureRequest,
    @Request() options: RequestOptions
  ): Promise<FeatureWithVariations> {
    return this.createFeature.execute(slug, feature, options.user);
  }

  @Get('features')
  @HttpCode(HttpStatus.OK)
  async list(@Param('slug') projectSlug: string, @Request() options: RequestOptions): Promise<ListFeatureResponse> {
    return this.listFeature.execute(projectSlug, options.user);
  }

  @Get('features/:key')
  @HttpCode(HttpStatus.OK)
  async get(
    @Param('slug') projectSlug: string,
    @Param('key') featureKey: string,
    @Request() options: RequestOptions
  ): Promise<FeatureWithVariations> {
    return this.getFeature.execute(projectSlug, featureKey, options.user);
  }
}
