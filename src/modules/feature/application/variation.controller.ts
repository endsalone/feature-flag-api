import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request } from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { CreateVariationRequest } from 'modules/feature/dtos/create-variation.request';
import { CreateVariation } from 'modules/feature/use-cases/create-variation';
import { GetVariation } from 'modules/feature/use-cases/get-variation';

@Controller('/projects')
export class VariationsController {
  constructor(private readonly createVariation: CreateVariation, private readonly getVariation: GetVariation) {}

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
}
