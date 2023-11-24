import { HttpStatus } from '@nestjs/common';
import { AccountErrorType, JsonApiError } from 'common/errors.type';

export class UserNotActive implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = AccountErrorType.USER_NOT_ACTIVE;
    this.detail = 'User account is not active';
    this.source = {};
  }
}
