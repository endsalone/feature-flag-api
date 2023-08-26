import { HttpStatus } from '@nestjs/common';
import { JsonApiError, VariationErrorType } from 'common/errors.type';

export class VariationTypeInvalidException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = VariationErrorType.VARIATION_TYPE_INVALID;
    this.detail = 'Variation type is invalid';
    this.source = { pointer: 'type' };
  }
}
