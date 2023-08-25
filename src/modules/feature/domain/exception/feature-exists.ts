import { HttpStatus } from '@nestjs/common';
import { FeatureErrorType, JsonApiError } from 'common/errors.type';

export class FeatureAlreadyExistsException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = FeatureErrorType.FEATURE_ALREADY_EXISTS;
    this.detail = 'Feature already exists';
    this.source = { pointer: 'key' };
  }
}
