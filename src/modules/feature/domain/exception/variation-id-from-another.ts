import { HttpStatus } from '@nestjs/common';
import { JsonApiError, VariationErrorType } from 'common/errors.type';

export class VariationIdFromAnother implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = VariationErrorType.VARIATION_ID_FROM_ANOTHER;
    this.detail = 'Variation id from another variation';
    this.source = { pointer: 'id' };
  }
}
