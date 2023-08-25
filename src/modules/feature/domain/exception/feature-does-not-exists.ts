import { HttpStatus } from '@nestjs/common';
import { FeatureErrorType, JsonApiError } from 'common/errors.type';

export class FeatureDoesNotExistException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.NOT_FOUND;
    this.code = FeatureErrorType.FEATURE_DOES_NOT_EXIST;
    this.detail = 'Feature does not exist';
    this.source = {};
  }
}
