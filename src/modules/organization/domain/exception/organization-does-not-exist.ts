import { HttpStatus } from '@nestjs/common';
import { JsonApiError, OrganizationErrorType } from 'common/errors.type';

export class OrganizationDoesNotExistException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.NOT_FOUND;
    this.code = OrganizationErrorType.ORGANIZATION_DOES_NOT_EXIST;
    this.detail = 'Organization does not exist';
    this.source = { pointer: 'hash' };
  }
}
