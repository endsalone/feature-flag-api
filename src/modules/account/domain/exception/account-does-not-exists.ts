import { HttpStatus } from "@nestjs/common";
import { AccountErrorType, JsonApiError } from "common/errors.type";

export class AccountDoesNotExistException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.NOT_FOUND;
    this.code = AccountErrorType.ACCOUNT_DOES_NOT_EXIST;
    this.detail = 'Account does not exist';
    this.source = {};
  }
}