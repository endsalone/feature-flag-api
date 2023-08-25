import { Body, Controller, HttpCode, HttpStatus, Param, Post, Request } from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { CreateVariationRequest } from 'modules/feature/dtos/create-variation.request';
import { CreateVariation } from 'modules/feature/use-cases/create-variation';

@Controller('/projects')
export class VariationsController {
  constructor(private readonly createFeature: CreateVariation) {}

  @Post('/:slug/variations')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('slug') slug: string,
    @Body() variation: CreateVariationRequest,
    @Request() options: RequestOptions
  ): Promise<unknown> {
    return this.createFeature.execute(slug, variation, options.user);
  }
}
