import { HttpStatus } from '@nestjs/common';
import { JsonApiError, OrganizationErrorType } from 'common/errors.type';

export class OrganizationInternalServerErrorException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    this.code = OrganizationErrorType.INTERNAL_SERVER_ERROR;
    this.detail = 'Organization does not exist';
    this.source = { pointer: 'hash' };
  }
}
