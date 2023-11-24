import { HttpStatus } from '@nestjs/common';
import { JsonApiError, RuleErrorType } from 'common/errors.type';

export class RuleDoesNotExistException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = RuleErrorType.RULE_DOES_NOT_EXIST;
    this.detail = 'Rule does not exist';
    this.source = { pointer: 'id' };
  }
}
