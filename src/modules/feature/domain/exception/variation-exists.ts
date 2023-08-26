import { HttpStatus } from '@nestjs/common';
import { JsonApiError, VariationErrorType } from 'common/errors.type';

export class VariationAlreadyExistsException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = VariationErrorType.VARIATION_ALREADY_EXISTS;
    this.detail = 'Variation already exists';
    this.source = { pointer: 'key' };
  }
}
