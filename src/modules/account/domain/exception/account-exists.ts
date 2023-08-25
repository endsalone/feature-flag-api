import { HttpStatus } from "@nestjs/common";
import { AccountErrorType, JsonApiError } from "common/errors.type";

export class AccountAlreadyExistsException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = AccountErrorType.ACCOUNT_ALREADY_EXISTS;
    this.detail = 'Account already exists';
    this.source = { pointer: 'email' };
  }
}