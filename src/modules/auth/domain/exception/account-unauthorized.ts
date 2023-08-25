import { HttpStatus } from "@nestjs/common";
import { AccountErrorType, JsonApiError } from "common/errors.type";

export class AccountUnauthorized implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.UNAUTHORIZED;
    this.code = AccountErrorType.UNAUTHORIZED;
    this.detail = 'account is unauthorized';
    this.source = {};
  }
}