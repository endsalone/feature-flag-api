import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request } from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { CreateFeatureRequest } from 'modules/feature/dtos/create-feature.request';
import { CreateFeature } from 'modules/feature/use-cases/create-feature';
import { GetFeature } from 'modules/feature/use-cases/get-feature';
import { ListFeature } from 'modules/feature/use-cases/list-feature';

@Controller('projects')
export class FeaturesController {
  constructor(
    private readonly createFeature: CreateFeature,
    private readonly listFeature: ListFeature,
    private readonly getFeature: GetFeature
  ) {}

  @Post('/:slug/features')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('slug') slug: string,
    @Body() feature: CreateFeatureRequest,
    @Request() options: RequestOptions
  ): Promise<unknown> {
    return this.createFeature.execute(slug, feature, options.user);
  }

  @Get('/:slug/features')
  @HttpCode(HttpStatus.OK)
  async list(@Param('slug') projectSlug: string, @Request() options: RequestOptions): Promise<unknown> {
    return this.listFeature.execute(projectSlug, options.user);
  }

  @Get('/:slug/features/:key')
  @HttpCode(HttpStatus.OK)
  async get(
    @Param('slug') projectSlug: string,
    @Param('key') featureKey: string,
    @Request() options: RequestOptions
  ): Promise<unknown> {
    return this.getFeature.execute(projectSlug, featureKey, options.user);
  }
}
