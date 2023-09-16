import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Request } from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { CreateVariationRequest } from 'modules/feature/dtos/create-variation.request';
import { UpdateVariationRequest } from 'modules/feature/dtos/update-variation.request';
import { CreateVariation } from 'modules/feature/use-cases/create-variation';
import { GetVariation } from 'modules/feature/use-cases/get-variation';
import { UpdateVariation } from 'modules/feature/use-cases/update-variation';

@Controller('/projects')
export class VariationsController {
  constructor(
    private readonly createVariation: CreateVariation,
    private readonly getVariation: GetVariation,
    private readonly updateVariation: UpdateVariation
  ) {}

  @Post('/:slug/variations')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('slug') slug: string,
    @Body() variation: CreateVariationRequest,
    @Request() options: RequestOptions
  ): Promise<unknown> {
    return this.createVariation.execute(slug, variation, options.user);
  }

  @Get('/:slug/variations/:key')
  @HttpCode(HttpStatus.OK)
  async get(
    @Param('slug') slug: string,
    @Param('key') key: string,
    @Request() options: RequestOptions
  ): Promise<unknown> {
    return this.getVariation.execute(slug, key, options.user);
  }

  @Put('/:slug/variations/:key')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('slug') slug: string,
    @Body() variation: UpdateVariationRequest,
    @Request() options: RequestOptions
  ): Promise<unknown> {
    return this.updateVariation.execute(variation, slug, options.user);
  }
}
