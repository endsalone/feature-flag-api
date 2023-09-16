import { HttpStatus } from '@nestjs/common';
import { JsonApiError, VariationErrorType } from 'common/errors.type';

export class VariationDoesNotExistException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = VariationErrorType.VARIATION_DOES_NOT_EXIST;
    this.detail = 'Variation does not exist';
    this.source = { pointer: 'key' };
  }
}
