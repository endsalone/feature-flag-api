import { HttpStatus } from '@nestjs/common';
import { JsonApiError, OrganizationErrorType } from 'common/errors.type';

export class OrganizationAlreadyExistsException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = OrganizationErrorType.ORGANIZATION_ALREADY_EXISTS;
    this.detail = 'Organization already exists';
    this.source = { pointer: 'key' };
  }
}
